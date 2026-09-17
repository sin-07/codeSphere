from typing import Dict, Any

class CostTrackerEngine:
    CI_MINUTE_RATE_USD = 0.008 # Standard Linux 2-core runner ($0.008/min)
    STORAGE_GB_MONTH_USD = 0.08 # Git LFS / storage
    AI_1K_TOKENS_USD = 0.0015 # Embeddings + LLM query cost average

    @classmethod
    def estimate_costs(cls, ci_minutes: int, storage_bytes: int, ai_queries: int) -> Dict[str, Any]:
        storage_gb = storage_bytes / (1024 * 1024 * 1024)
        storage_cost = storage_gb * cls.STORAGE_GB_MONTH_USD
        ci_cost = ci_minutes * cls.CI_MINUTE_RATE_USD
        
        # Assume ~1200 tokens per AI codebase query
        est_tokens = ai_queries * 1200
        ai_cost = (est_tokens / 1000) * cls.AI_1K_TOKENS_USD

        total_cost = ci_cost + storage_cost + ai_cost

        return {
            "totalCostUsd": round(total_cost, 2),
            "breakdown": {
                "ciCompute": {
                    "minutesUsed": ci_minutes,
                    "costUsd": round(ci_cost, 2),
                    "unitRate": f"${cls.CI_MINUTE_RATE_USD}/min"
                },
                "gitStorage": {
                    "storageGb": round(storage_gb, 3),
                    "costUsd": round(storage_cost, 2),
                    "unitRate": f"${cls.STORAGE_GB_MONTH_USD}/GB-mo"
                },
                "aiBrainUsage": {
                    "queriesProcessed": ai_queries,
                    "estimatedTokens": est_tokens,
                    "costUsd": round(ai_cost, 2),
                    "unitRate": f"${cls.AI_1K_TOKENS_USD}/1K tokens"
                }
            },
            "projectedAnnual": round(total_cost * 12, 2),
            "savingsVersusGitHubEnterprise": round(max(0, (21.0 * 5) - total_cost), 2) # $21/user/mo for 5 seats
        }
