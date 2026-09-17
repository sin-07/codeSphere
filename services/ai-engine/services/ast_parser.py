import ast
import re
from typing import List, Dict, Any

class CodeASTParser:
    @staticmethod
    def parse_python(code: str, filename: str = "script.py") -> Dict[str, Any]:
        """Parse Python source code using standard library AST module."""
        try:
            tree = ast.parse(code, filename=filename)
        except SyntaxError as e:
            return {
                "error": f"SyntaxError at line {e.lineno}: {e.msg}",
                "functions": [],
                "classes": [],
                "imports": [],
                "complexity": 1
            }

        functions = []
        classes = []
        imports = []
        complexity = 1

        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.With, ast.Assert)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1

            if isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                args = [arg.arg for arg in node.args.args]
                docstring = ast.get_docstring(node) or ""
                functions.append({
                    "name": node.name,
                    "line": node.lineno,
                    "endLine": getattr(node, 'end_lineno', node.lineno),
                    "args": args,
                    "docstring": docstring[:100],
                    "isAsync": isinstance(node, ast.AsyncFunctionDef)
                })
            elif isinstance(node, ast.ClassDef):
                docstring = ast.get_docstring(node) or ""
                bases = [b.id if isinstance(b, ast.Name) else "unknown" for b in node.bases]
                methods = [n.name for n in node.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
                classes.append({
                    "name": node.name,
                    "line": node.lineno,
                    "endLine": getattr(node, 'end_lineno', node.lineno),
                    "bases": bases,
                    "methods": methods,
                    "docstring": docstring[:100]
                })
            elif isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append({
                        "module": alias.name,
                        "alias": alias.asname,
                        "line": node.lineno
                    })
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    imports.append({
                        "module": f"{module}.{alias.name}" if module else alias.name,
                        "alias": alias.asname,
                        "line": node.lineno
                    })

        return {
            "functions": functions,
            "classes": classes,
            "imports": imports,
            "complexity": complexity,
            "totalSymbols": len(functions) + len(classes)
        }

    @staticmethod
    def parse_js_ts(code: str, filename: str = "file.ts") -> Dict[str, Any]:
        """Robust regex-based symbol and complexity extractor for JavaScript/TypeScript."""
        functions = []
        classes = []
        imports = []
        lines = code.splitlines()
        complexity = 1

        # Match function declarations: function foo(x, y), async function bar(), const baz = (a) =>
        func_regex = re.compile(r'(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)')
        arrow_regex = re.compile(r'(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>')
        class_regex = re.compile(r'(?:export\s+)?class\s+([a-zA-Z0-9_$]+)(?:\s+extends\s+([a-zA-Z0-9_$]+))?')
        import_regex = re.compile(r'import\s+(?:(?:\*\s+as\s+([a-zA-Z0-9_$]+))|(?:\{([^}]+)\})|([a-zA-Z0-9_$]+))?\s*from\s*[\'"]([^\'"]+)[\'"]')

        for idx, line in enumerate(lines):
            lineno = idx + 1
            # Check complexity indicators
            if re.search(r'\b(if|for|while|catch|case|&&|\|\|)\b', line):
                complexity += 1

            # Match functions
            f_match = func_regex.search(line)
            if f_match:
                functions.append({
                    "name": f_match.group(1),
                    "line": lineno,
                    "args": [a.strip() for a in f_match.group(2).split(',') if a.strip()],
                    "isAsync": "async" in line
                })
                continue

            a_match = arrow_regex.search(line)
            if a_match:
                functions.append({
                    "name": a_match.group(1),
                    "line": lineno,
                    "args": [a.strip() for a in a_match.group(2).split(',') if a.strip()],
                    "isAsync": "async" in line
                })
                continue

            c_match = class_regex.search(line)
            if c_match:
                classes.append({
                    "name": c_match.group(1),
                    "line": lineno,
                    "extends": c_match.group(2) if c_match.group(2) else None
                })
                continue

            i_match = import_regex.search(line)
            if i_match:
                raw_module = i_match.group(4)
                imports.append({
                    "module": raw_module,
                    "line": lineno
                })

        return {
            "functions": functions,
            "classes": classes,
            "imports": imports,
            "complexity": complexity,
            "totalSymbols": len(functions) + len(classes)
        }

    @classmethod
    def parse(cls, code: str, filename: str) -> Dict[str, Any]:
        ext = filename.split('.')[-1].lower() if '.' in filename else ''
        if ext in ('py', 'pyw'):
            return cls.parse_python(code, filename)
        elif ext in ('js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'):
            return cls.parse_js_ts(code, filename)
        else:
            return {
                "functions": [],
                "classes": [],
                "imports": [],
                "complexity": max(1, code.count('\n') // 20),
                "totalSymbols": 0
            }
