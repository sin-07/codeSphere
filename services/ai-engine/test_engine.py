from services.ast_parser import CodeASTParser
from services.code_search import SemanticCodeSearchEngine
from services.debugger import AIDebugger
from services.risk_analyzer import PRRiskAnalyzer
from services.architecture import ArchitectureMapBuilder
from services.security import SecurityScanner
from services.health_metrics import HealthMetricsEngine
from services.cost_tracker import CostTrackerEngine

def run_tests():
    print("Testing CodeSphere AI Engine Components...")

    # 1. AST Parser test
    ts_code = """
    export async function authenticateUser(token: string) {
        if (!token) throw new Error("Missing token");
        return { id: 1, name: "Alice" };
    }
    export class AuthService {
        validate() { return true; }
    }
    """
    ast_res = CodeASTParser.parse(ts_code, "auth.ts")
    assert len(ast_res["functions"]) >= 1, "AST should extract functions"
    assert len(ast_res["classes"]) >= 1, "AST should extract classes"
    print(" [x] AST Parser: PASSED")

    # 2. Semantic Code Search test
    engine = SemanticCodeSearchEngine()
    files = [
        {"path": "src/auth/jwt.ts", "content": "export function signJwt(payload) { return jwt.sign(payload, SECRET); }"},
        {"path": "src/db/mongo.ts", "content": "export function connectMongo() { mongoose.connect(URI); }"}
    ]
    idx = engine.index_files(files)
    search_res = engine.search(idx, "jwt authentication token")
    assert len(search_res) > 0, "Semantic search should return matches"
    assert "jwt.ts" in search_res[0]["path"], "Top result should be jwt.ts"
    print(" [x] Semantic Code Search: PASSED")

    # 3. AI Debugger test
    error_log = """
TypeError: Cannot read properties of undefined (reading 'profile')
    at getUserProfile (src/controllers/user.ts:42:15)
    at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
"""
    debug_res = AIDebugger.analyze_error(error_log)
    assert "TypeError" in debug_res["errorType"], "Should detect TypeError"
    assert debug_res["line"] == 42, "Should identify line 42"
    assert "patch" in debug_res and len(debug_res["patch"]) > 0, "Should generate patch diff"
    print(" [x] AI Debugger: PASSED")

    # 4. PR Risk Analyzer test
    files_changed = [
        {"filename": "src/auth/jwt.ts", "additions": 80, "deletions": 20},
        {"filename": "src/models/user.ts", "additions": 150, "deletions": 40}
    ]
    risk_res = PRRiskAnalyzer.analyze(files_changed, "- export function verifyToken(t: string)")
    assert risk_res["riskScore"] > 40, "Touching auth & models should escalate risk score"
    assert len(risk_res["breakingChanges"]) > 0, "Should detect deleted export as breaking change"
    print(" [x] PR Risk Analyzer: PASSED")

    # 5. Architecture Map Builder test
    files_arch = [
        {"path": "src/routes/user.ts", "content": "import { getUser } from '../services/user';"},
        {"path": "src/services/user.ts", "content": "import { UserModel } from '../models/user';"},
        {"path": "src/models/user.ts", "content": "export const UserModel = {};"}
    ]
    arch_res = ArchitectureMapBuilder.build_graph(files_arch)
    assert arch_res["totalModules"] == 3, "Should register 3 modules"
    assert arch_res["totalDependencies"] >= 1, "Should link dependencies"
    print(" [x] Architecture Map: PASSED")

    # 6. Security Scanner test
    files_sec = [
        {"path": "config.js", "content": "const token = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';"},
        {"path": "package.json", "content": '{"dependencies": {"lodash": "4.17.15"}}'}
    ]
    sec_res = SecurityScanner.run_full_scan(files_sec)
    assert len(sec_res["secrets"]) >= 1, "Should catch GitHub token leak"
    assert len(sec_res["vulnerabilities"]) >= 1, "Should catch lodash CVE"
    print(" [x] Security & Secrets Scanner: PASSED")

    # 7. Health Metrics & Away Summary test
    commits = [{"author": "alice", "message": "initial commit"}, {"author": "alice", "message": "update auth"}]
    health_res = HealthMetricsEngine.calculate_health(commits, 2, 8)
    assert health_res["busFactor"] >= 1, "Bus factor calculated"
    away_res = HealthMetricsEngine.generate_away_summary(commits, [], [], "7d")
    assert len(away_res["keyHighlights"]) > 0, "Away summary generated"
    print(" [x] Health Metrics & Away Summary: PASSED")

    # 8. Cost Tracker test
    cost_res = CostTrackerEngine.estimate_costs(ci_minutes=120, storage_bytes=1024*1024*1024, ai_queries=50)
    assert cost_res["totalCostUsd"] > 0, "Cost should be computed"
    print(" [x] Cloud & AI Cost Tracker: PASSED")

    print("\nALL 8 AI REPOSITORY BRAIN COMPONENTS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
