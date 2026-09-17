from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from services.ast_parser import CodeASTParser
from services.code_search import SemanticCodeSearchEngine
from services.debugger import AIDebugger
from services.risk_analyzer import PRRiskAnalyzer
from services.architecture import ArchitectureMapBuilder
from services.security import SecurityScanner
from services.health_metrics import HealthMetricsEngine
from services.cost_tracker import CostTrackerEngine

app = FastAPI(
    title="CodeSphere AI Repository Brain & Intelligence Service",
    version="1.0.0",
    description="Real-time AST parsing, semantic codebase search, PR risk scoring, security scanning, and architecture mapping."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

search_engine = SemanticCodeSearchEngine()

# Pydantic Schemas
class ASTRequest(BaseModel):
    code: str
    filename: str = "source.ts"

class CodeFile(BaseModel):
    path: str
    content: str

class IndexRequest(BaseModel):
    files: List[CodeFile]

class SearchRequest(BaseModel):
    indexData: Dict[str, Any]
    query: str
    topK: int = 5

class DirectSearchRequest(BaseModel):
    files: List[CodeFile]
    query: str
    topK: int = 5

class ExplainRequest(BaseModel):
    code: str
    path: Optional[str] = ""
    query: Optional[str] = ""

class DebugRequest(BaseModel):
    errorLog: str
    codeContext: Optional[str] = None
    filePath: Optional[str] = None

class RiskRequest(BaseModel):
    filesChanged: List[Dict[str, Any]]
    diffText: Optional[str] = ""

class ArchitectureRequest(BaseModel):
    files: List[CodeFile]

class SecurityScanRequest(BaseModel):
    files: List[CodeFile]

class HealthMetricsRequest(BaseModel):
    commits: List[Dict[str, Any]]
    openIssues: int = 0
    closedIssues: int = 0

class AwaySummaryRequest(BaseModel):
    recentCommits: List[Dict[str, Any]]
    recentPrs: List[Dict[str, Any]]
    recentIssues: List[Dict[str, Any]]
    timeWindow: str = "7d"

class CostEstimateRequest(BaseModel):
    ciMinutes: int = 0
    storageBytes: int = 0
    aiQueries: int = 0


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "CodeSphere AI Brain",
        "version": "1.0.0",
        "capabilities": [
            "ast_parser",
            "semantic_code_search",
            "ai_debugger",
            "pr_risk_analyzer",
            "architecture_map",
            "security_scanner",
            "health_metrics",
            "cost_tracker"
        ]
    }

@app.post("/api/brain/ast")
def parse_ast(req: ASTRequest):
    return CodeASTParser.parse(req.code, req.filename)

@app.post("/api/brain/index")
def index_repository(req: IndexRequest):
    files_list = [{"path": f.path, "content": f.content} for f in req.files]
    return search_engine.index_files(files_list)

@app.post("/api/brain/search")
def search_code(req: SearchRequest):
    return search_engine.search(req.indexData, req.query, req.topK)

@app.post("/api/brain/direct-search")
def direct_search_code(req: DirectSearchRequest):
    files_list = [{"path": f.path, "content": f.content} for f in req.files]
    index_data = search_engine.index_files(files_list)
    results = search_engine.search(index_data, req.query, req.topK)
    return {
        "results": results,
        "totalSearched": len(files_list),
        "query": req.query
    }

@app.post("/api/brain/explain")
def explain_code(req: ExplainRequest):
    return search_engine.explain_code(req.code, req.path or "", req.query or "")

@app.post("/api/debug/analyze")
def debug_error(req: DebugRequest):
    return AIDebugger.analyze_error(req.errorLog, req.codeContext, req.filePath)

@app.post("/api/risk/analyze-pr")
def analyze_pr_risk(req: RiskRequest):
    return PRRiskAnalyzer.analyze(req.filesChanged, req.diffText or "")

@app.post("/api/arch/graph")
def build_architecture_graph(req: ArchitectureRequest):
    files_list = [{"path": f.path, "content": f.content} for f in req.files]
    return ArchitectureMapBuilder.build_graph(files_list)

@app.post("/api/security/scan")
def scan_security(req: SecurityScanRequest):
    files_list = [{"path": f.path, "content": f.content} for f in req.files]
    return SecurityScanner.run_full_scan(files_list)

@app.post("/api/health/metrics")
def calculate_health(req: HealthMetricsRequest):
    return HealthMetricsEngine.calculate_health(req.commits, req.openIssues, req.closedIssues)

@app.post("/api/health/away-summary")
def get_away_summary(req: AwaySummaryRequest):
    return HealthMetricsEngine.generate_away_summary(
        req.recentCommits, req.recentPrs, req.recentIssues, req.timeWindow
    )

@app.post("/api/cost/estimate")
def estimate_cost(req: CostEstimateRequest):
    return CostTrackerEngine.estimate_costs(req.ciMinutes, req.storageBytes, req.aiQueries)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
