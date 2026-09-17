import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

class HealthMetricsEngine:
    @staticmethod
    def calculate_health(commits: List[Dict[str, Any]], open_issues: int, closed_issues: int) -> Dict[str, Any]:
        """
        Computes project maintainability, velocity, code churn, and bus factor.
        """
        total_commits = len(commits)
        authors = {}
        churn_history = []

        for c in commits:
            author = c.get("author", "unknown")
            authors[author] = authors.get(author, 0) + 1

        # Bus factor: minimum number of authors making up > 70% of commits
        sorted_authors = sorted(authors.items(), key=lambda x: x[1], reverse=True)
        running_commits = 0
        bus_factor = 0
        threshold = total_commits * 0.7 if total_commits > 0 else 0

        for author, count in sorted_authors:
            bus_factor += 1
            running_commits += count
            if running_commits >= threshold:
                break

        bus_factor = max(1, bus_factor)

        # Issue resolution rate
        total_issues = open_issues + closed_issues
        resolution_rate = (closed_issues / total_issues * 100) if total_issues > 0 else 100.0

        # Maintainability index (0 - 100)
        maintainability = min(100, int(60 + (min(bus_factor, 4) * 5) + (resolution_rate * 0.2)))

        return {
            "healthScore": maintainability,
            "busFactor": bus_factor,
            "activeContributors": len(authors),
            "commitVelocity": round(total_commits / 4.0, 1), # commits per week avg
            "issueResolutionRate": round(resolution_rate, 1),
            "topContributors": [{"author": a, "commits": c, "share": round((c / total_commits * 100) if total_commits else 0, 1)} for a, c in sorted_authors[:5]],
            "healthRating": "EXCELLENT" if maintainability >= 80 else ("GOOD" if maintainability >= 65 else "AT_RISK")
        }

    @staticmethod
    def generate_away_summary(recent_commits: List[Dict[str, Any]], recent_prs: List[Dict[str, Any]], recent_issues: List[Dict[str, Any]], time_window: str = "7d") -> Dict[str, Any]:
        """
        Generates structured 'What Changed While You Were Away' executive digest.
        """
        commit_count = len(recent_commits)
        pr_count = len(recent_prs)
        issue_count = len(recent_issues)

        key_highlights = []
        if commit_count > 0:
            top_messages = [c.get("message", "").split('\n')[0] for c in recent_commits[:4]]
            key_highlights.append(f"Pushed {commit_count} commits across main branches, including: '{top_messages[0]}'")
        if pr_count > 0:
            merged_prs = [pr for pr in recent_prs if pr.get("status") == "merged"]
            key_highlights.append(f"Merged {len(merged_prs)} pull requests bringing improvements to architecture and features.")
        if issue_count > 0:
            key_highlights.append(f"Activity on {issue_count} issues (bug fixes and enhancements tracked).")

        if not key_highlights:
            key_highlights = ["No significant changes recorded during this interval. The codebase remains stable."]

        return {
            "timeWindow": time_window,
            "metrics": {
                "commits": commit_count,
                "pullRequests": pr_count,
                "issues": issue_count
            },
            "executiveSummary": f"Over the past {time_window}, the team registered {commit_count} commits and {pr_count} pull requests. Overall code momentum is active.",
            "keyHighlights": key_highlights,
            "recommendedReviewItems": [c.get("message", "")[:60] for c in recent_commits[:3]]
        }
