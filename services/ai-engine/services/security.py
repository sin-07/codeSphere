import re
import json
from typing import List, Dict, Any

class SecurityScanner:
    SECRET_REGEXES = [
        ("AWS Access Key ID", r'AKIA[0-9A-Z]{16}', "CRITICAL"),
        ("Generic Private Key", r'-----BEGIN (?:RSA|OPENSSH|EC|DSA)? PRIVATE KEY-----', "CRITICAL"),
        ("GitHub Personal Access Token", r'gh[pousr]_[0-9a-zA-Z]{36}', "HIGH"),
        ("Slack Webhook / Token", r'https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+', "HIGH"),
        ("Database URI with Password", r'mongodb(?:\+srv)?:\/\/[^:]+:([^@]+)@', "HIGH"),
        ("JWT Secret Hardcoded", r'(?:jwt_secret|jwtSecret|JWT_SECRET)\s*=\s*[\'"][^\'"]{6,}[\'"]', "MEDIUM"),
        ("Generic API Key / Secret", r'(?:api_key|apiKey|secret_key|client_secret)\s*[:=]\s*[\'"][a-zA-Z0-9_\-]{16,}?[\'"]', "MEDIUM"),
    ]

    KNOWN_VULNERABILITIES = [
        {
            "package": "lodash",
            "vulnerableRange": "<4.17.21",
            "cve": "CVE-2021-23337",
            "severity": "HIGH",
            "title": "Command Injection in template",
            "remediation": "Upgrade lodash to 4.17.21 or higher"
        },
        {
            "package": "express",
            "vulnerableRange": "<4.19.2",
            "cve": "CVE-2024-29041",
            "severity": "MEDIUM",
            "title": "Open Redirect vulnerability",
            "remediation": "Upgrade express to 4.19.2 or higher"
        },
        {
            "package": "axios",
            "vulnerableRange": "<1.6.0",
            "cve": "CVE-2023-45857",
            "severity": "HIGH",
            "title": "Cross-Site Request Forgery (CSRF) / SSRF in follows",
            "remediation": "Upgrade axios to 1.6.0 or higher"
        },
        {
            "package": "jsonwebtoken",
            "vulnerableRange": "<9.0.0",
            "cve": "CVE-2022-23529",
            "severity": "CRITICAL",
            "title": "Insecure Key Retrieval in verify",
            "remediation": "Upgrade jsonwebtoken to 9.0.0 or higher"
        },
        {
            "package": "urllib3",
            "vulnerableRange": "<2.0.7",
            "cve": "CVE-2023-45803",
            "severity": "MEDIUM",
            "title": "Request body strip on 303 redirect",
            "remediation": "Upgrade urllib3 to 2.0.7 or higher"
        }
    ]

    @classmethod
    def scan_files_for_secrets(cls, files: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        findings = []
        for f in files:
            path = f.get("path", "")
            content = f.get("content", "")
            lines = content.splitlines()

            for line_idx, line in enumerate(lines):
                for name, pattern, severity in cls.SECRET_REGEXES:
                    match = re.search(pattern, line)
                    if match:
                        findings.append({
                            "type": "SECRET_LEAK",
                            "name": name,
                            "severity": severity,
                            "file": path,
                            "line": line_idx + 1,
                            "snippet": line[:60] + "...",
                            "recommendation": f"Remove {name} from code and rotate the credential immediately."
                        })
        return findings

    @classmethod
    def scan_manifests(cls, files: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        vulnerabilities = []
        for f in files:
            path = f.get("path", "")
            content = f.get("content", "")

            if path.endswith("package.json"):
                try:
                    pkg = json.loads(content)
                    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
                    for vul in cls.KNOWN_VULNERABILITIES:
                        if vul["package"] in deps:
                            installed = deps[vul["package"]].replace('^', '').replace('~', '')
                            # Simplistic version check comparison
                            vulnerabilities.append({
                                "type": "VULNERABLE_DEPENDENCY",
                                "package": vul["package"],
                                "installedVersion": installed,
                                "cve": vul["cve"],
                                "severity": vul["severity"],
                                "title": vul["title"],
                                "remediation": vul["remediation"],
                                "file": path
                            })
                except Exception:
                    pass

        return vulnerabilities

    @classmethod
    def run_full_scan(cls, files: List[Dict[str, str]]) -> Dict[str, Any]:
        secrets = cls.scan_files_for_secrets(files)
        deps = cls.scan_manifests(files)

        total_issues = len(secrets) + len(deps)
        critical_count = sum(1 for i in secrets + deps if i["severity"] == "CRITICAL")
        high_count = sum(1 for i in secrets + deps if i["severity"] == "HIGH")
        medium_count = sum(1 for i in secrets + deps if i["severity"] == "MEDIUM")

        security_score = max(0, 100 - (critical_count * 30 + high_count * 15 + medium_count * 5))

        return {
            "securityScore": security_score,
            "summary": {
                "total": total_issues,
                "critical": critical_count,
                "high": high_count,
                "medium": medium_count
            },
            "secrets": secrets,
            "vulnerabilities": deps,
            "status": "PASSED" if critical_count == 0 and high_count == 0 else "ACTION_REQUIRED"
        }
