# GitHub Actions Workflows

## assign-copilot-to-issues.yml

This workflow automatically assigns a coding agent to newly opened issues.

### How it works

1. **Trigger**: Runs when a new issue is opened
2. **Permissions**: Requires `issues: write` permission to assign users
3. **Assignment Logic**: 
   - First tries to assign "Copilot" 
   - Falls back to "copilot-swe-agent" if Copilot is not available
   - Falls back to the repository owner if neither coding agent is available
   - If all assignments fail, adds a comment explaining the failure

### Error Handling

- Checks if potential assignees are collaborators before attempting assignment
- Provides detailed logging for debugging
- Gracefully handles permission errors
- Adds explanatory comments when auto-assignment fails

### Troubleshooting

If you see "Resource not accessible by integration" errors:
1. Ensure the workflow has `issues: write` permissions
2. Verify that the intended assignee is a collaborator on the repository
3. Check that the `GITHUB_TOKEN` has sufficient permissions

The workflow will automatically fall back to assigning the repository owner if the coding agents are not available.