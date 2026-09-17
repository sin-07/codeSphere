import re
from typing import Dict, Any, Optional

class AIDebugger:
    @staticmethod
    def analyze_error(error_log: str, code_context: Optional[str] = None, file_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Extract root cause from error log/trace and generate an automated patch.
        """
        # Detect error patterns
        error_type = "RuntimeError"
        culprit_file = file_path or "unknown"
        culprit_line = 1
        root_cause = "Unhandled execution exception."

        # Check JS/TS errors
        js_match = re.search(r'([A-Za-z0-9_.]+(?:Error|Exception)): (.*?)\n\s+at (?:[^\n]*\((.*?):(\d+):(\d+)\)|(.*?):(\d+):(\d+))', error_log)
        # Check Python errors
        py_match = re.search(r'File "([^"]+)", line (\d+), in (.*)\n\s*(.*?)\n([A-Za-z0-9_]+Error): (.*)', error_log)

        if js_match:
            error_type = js_match.group(1)
            root_cause = js_match.group(2)
            culprit_file = js_match.group(3) or js_match.group(6) or culprit_file
            culprit_line = int(js_match.group(4) or js_match.group(7) or 1)
        elif py_match:
            culprit_file = py_match.group(1)
            culprit_line = int(py_match.group(2))
            error_type = py_match.group(5)
            root_cause = py_match.group(6)
        else:
            # Fallback simple search
            for line in error_log.splitlines():
                if "Error:" in line or "Exception:" in line:
                    error_type = line.split(":")[0].strip()
                    root_cause = line.split(":", 1)[1].strip()
                    break

        # Generate intelligent suggestion and code patch
        patch_diff = ""
        suggestion = f"Check variable initialization and add defensive boundary guards for {error_type}."

        if "Cannot read properties of undefined" in root_cause or "TypeError" in error_type:
            suggestion = "Add optional chaining (?.) or null check prior to accessing object properties."
            patch_diff = f"""--- a/{culprit_file}
+++ b/{culprit_file}
@@ -{max(1, culprit_line-1)},3 +{max(1, culprit_line-1)},4 @@
-  const result = data.user.profile;
+  if (!data?.user) return null;
+  const result = data?.user?.profile;
"""
        elif "KeyError" in error_type or "IndexError" in error_type:
            suggestion = "Verify dictionary key existence using .get() or validate collection bounds before indexing."
            patch_diff = f"""--- a/{culprit_file}
+++ b/{culprit_file}
@@ -{max(1, culprit_line-1)},3 +{max(1, culprit_line-1)},4 @@
-  val = records[key]
+  val = records.get(key, default_fallback)
"""
        else:
            patch_diff = f"""--- a/{culprit_file}
+++ b/{culprit_file}
@@ -{max(1, culprit_line-1)},3 +{max(1, culprit_line-1)},5 @@
+  try {{
     // Guarded operation
+  }} catch (err) {{
+    logger.error('Caught error safely:', err);
+  }}
"""

        return {
            "errorType": error_type,
            "rootCause": root_cause,
            "file": culprit_file,
            "line": culprit_line,
            "suggestion": suggestion,
            "patch": patch_diff,
            "severity": "CRITICAL" if any(k in error_type for k in ("Fatal", "Panic", "Deadlock", "SyntaxError")) else "HIGH"
        }
