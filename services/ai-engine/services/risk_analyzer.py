import re
from typing import List, Dict, Any

class PRRiskAnalyzer:
    CRITICAL_PATTERNS = [
        r'auth', r'security', r'token', r'password', r'payment', r'billing',
        r'schema', r'migration', r'database', r'db', r'config', r'secret', r'env'
    ]

    @classmethod
    def analyze(cls, files_changed: List[Dict[str, Any]], diff_text: str = "") -> Dict[str, Any]:
        """
        Calculates blast radius, breaking changes, and a risk score (0-100).
        """
        score = 10
        risk_factors = []
        breaking_changes = []
        critical_files_touched = []
        tests_added_or_modified = False

        total_additions = sum(f.get("additions", 0) for f in files_changed)
        total_deletions = sum(f.get("deletions", 0) for f in files_changed)
        total_churn = total_additions + total_deletions

        # 1. Churn scale
        if total_churn > 500:
            score += 30
            risk_factors.append(f"High code churn ({total_churn} total lines changed).")
        elif total_churn > 150:
            score += 15
            risk_factors.append(f"Moderate code churn ({total_churn} lines changed).")

        # 2. Critical files check
        for file in files_changed:
            path = file.get("filename", "")
            if any(re.search(pat, path, re.IGNORECASE) for pat in cls.CRITICAL_PATTERNS):
                critical_files_touched.append(path)
            if any(test_keyword in path.lower() for test_keyword in ("test", "spec", "__tests__")):
                tests_added_or_modified = True

        if critical_files_touched:
            score += min(35, len(critical_files_touched) * 12)
            risk_factors.append(f"Touches critical security/database infrastructure ({len(critical_files_touched)} files).")

        # 3. Test coverage impact
        if not tests_added_or_modified and total_churn > 50:
            score += 20
            risk_factors.append("No corresponding unit/integration test files modified.")

        # 4. Breaking changes detection (deletion of exported symbols or breaking parameters)
        deleted_exports = re.findall(r'-\s*(?:export\s+(?:function|class|const|interface|type)\s+([A-Za-z0-9_$]+)|def\s+([A-Za-z0-9_$]+))', diff_text)
        for de in deleted_exports:
            sym = de[0] or de[1]
            if sym:
                breaking_changes.append({
                    "symbol": sym,
                    "type": "Deleted exported API symbol",
                    "impact": "Dependent consumer modules may fail to compile or resolve symbol."
                })
                score += 15

        final_score = min(100, max(5, score))
        risk_tier = "LOW"
        if final_score >= 70:
            risk_tier = "CRITICAL"
        elif final_score >= 45:
            risk_tier = "MEDIUM"

        return {
            "riskScore": final_score,
            "riskTier": risk_tier,
            "blastRadius": {
                "totalFiles": len(files_changed),
                "churn": total_churn,
                "additions": total_additions,
                "deletions": total_deletions,
                "criticalFiles": critical_files_touched
            },
            "riskFactors": risk_factors if risk_factors else ["Low impact isolated changes."],
            "breakingChanges": breaking_changes,
            "hasTests": tests_added_or_modified,
            "recommendedAction": "Requires 2 Senior Reviewers and complete staging regression run." if final_score >= 60 else "Standard code review flow."
        }
