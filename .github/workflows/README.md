# GitHub Actions Workflows

## assign-copilot-to-issues.yml

This workflow automatically assigns a coding agent to newly opened issues.

### How it works

1. **Trigger**: Runs when a new issue is opened
2. **Permissions**: Requires `issues: write` permission to assign users
3. **Assignment Logic**: 
   - First tries to assign "Copilot" using GraphQL API (proper method for GitHub Copilot)
   - Falls back to "copilot-swe-agent" via REST API if Copilot assignment fails
   - Falls back to the repository owner via REST API if neither coding agent is available
   - If all assignments fail, adds a comment explaining the failure

### Technical Details

- **Copilot Assignment**: Uses GraphQL `assignCopilotToIssue` mutation for proper Copilot integration
- **Fallback Assignments**: Uses REST API `addAssignees` for regular GitHub users
- **Issue Node ID**: Fetches the issue's GraphQL node ID for the Copilot assignment mutation

### Error Handling

- Checks if potential assignees are collaborators before attempting assignment
- Provides detailed logging for debugging
- Gracefully handles permission errors
- Adds explanatory comments when auto-assignment fails

### Troubleshooting

If you see "Resource not accessible by integration" errors:
1. **For Copilot assignment**: This was fixed by switching to GraphQL API instead of REST API
2. Ensure the workflow has `issues: write` permissions
3. Verify that fallback assignees are collaborators on the repository
4. Check that the `GITHUB_TOKEN` has sufficient permissions

**Previous Issue**: The workflow was trying to assign "Copilot" as a regular user via REST API, which returns a 403 error. This is now fixed by using the proper GraphQL `assignCopilotToIssue` mutation.

The workflow will automatically fall back to assigning regular users if the Copilot assignment fails.