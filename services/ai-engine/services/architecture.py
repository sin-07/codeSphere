import re
from typing import List, Dict, Any

class ArchitectureMapBuilder:
    @staticmethod
    def classify_tier(filepath: str) -> str:
        fp = filepath.lower()
        if any(x in fp for x in ['components', 'pages', 'views', 'app', 'ui', 'frontend']):
            return "UI / Frontend"
        elif any(x in fp for x in ['routes', 'controllers', 'api', 'endpoints']):
            return "API & Gateway"
        elif any(x in fp for x in ['services', 'usecase', 'engine', 'logic']):
            return "Service Layer"
        elif any(x in fp for x in ['models', 'schemas', 'entities', 'db', 'database', 'prisma']):
            return "Database & Storage"
        elif any(x in fp for x in ['utils', 'helpers', 'lib', 'common']):
            return "Shared Utilities"
        return "Core Module"

    @classmethod
    def build_graph(cls, files: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Builds nodes and edges for architecture dependency graph.
        files: [{"path": "src/routes/user.ts", "content": "import { UserService } from '../services/user'"}]
        """
        nodes = []
        edges = []
        file_paths = {f["path"]: f for f in files}

        node_ids = set()

        for f in files:
            path = f["path"]
            if not path or path.startswith(('.git', 'node_modules', 'dist', 'build')):
                continue

            node_id = path
            tier = cls.classify_tier(path)
            content = f.get("content", "")
            lines = content.splitlines()

            nodes.append({
                "id": node_id,
                "label": path.split('/')[-1],
                "path": path,
                "tier": tier,
                "loc": len(lines)
            })
            node_ids.add(node_id)

            # Extract imports (from '...', require('...'), import '...')
            import_matches = re.findall(r'(?:from|require|import)\s*\(?[\'"]([^\'"]+)[\'"]\)?', content)
            for imp in import_matches:
                # Remove leading relative dots
                clean_imp = re.sub(r'^\.+/', '', imp)
                clean_imp_base = clean_imp.split('/')[-1]
                for target_path in file_paths.keys():
                    target_base = target_path.split('/')[-1].split('.')[0]
                    if target_path != node_id and (clean_imp in target_path or clean_imp_base == target_base):
                        edges.append({
                            "source": node_id,
                            "target": target_path,
                            "type": "imports"
                        })
                        break

        # Group summary
        tiers_summary: Dict[str, int] = {}
        for n in nodes:
            t = n["tier"]
            tiers_summary[t] = tiers_summary.get(t, 0) + 1

        return {
            "nodes": nodes,
            "edges": edges,
            "tiers": tiers_summary,
            "totalModules": len(nodes),
            "totalDependencies": len(edges)
        }
