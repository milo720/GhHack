# GitHub Actions Workflows

## assign-copilot-to-issues.yml

This workflow automatically assigns GitHub Copilot coding agent to newly opened issues following the official GitHub documentation.

### How it works

1. **Trigger**: Runs when a new issue is opened
2. **Permissions**: Requires `issues: write` permission to assign users
3. **Assignment Process** (following GitHub's official documentation):
   - Verifies Copilot coding agent is enabled by checking `suggestedActors` with `CAN_BE_ASSIGNED` capability
   - Looks for `copilot-swe-agent` bot in the suggested actors
   - Fetches the issue's GraphQL global ID
   - Uses `replaceActorsForAssignable` mutation to assign the Copilot agent

### Technical Details

- **GraphQL API**: Uses the proper GitHub GraphQL API for Copilot assignment
- **Authentication**: Uses `GITHUB_TOKEN` (user token required for Copilot operations)
- **Copilot Bot ID**: Automatically retrieves the bot ID from the repository's suggested actors
- **Issue Assignment**: Uses the official `replaceActorsForAssignable` mutation

### API Calls

1. **Check Copilot Availability**:
   ```graphql
   query {
     repository(owner: "owner", name: "repo") {
       suggestedActors(capabilities: [CAN_BE_ASSIGNED], first: 100) {
         nodes {
           login
           __typename
           ... on Bot { id }
           ... on User { id }
         }
       }
     }
   }
   ```

2. **Get Issue ID**:
   ```graphql
   query {
     repository(owner: "owner", name: "repo") {
       issue(number: issueNumber) {
         id
         title
       }
     }
   }
   ```

3. **Assign Copilot**:
   ```graphql
   mutation {
     replaceActorsForAssignable(input: {assignableId: "issueId", actorIds: ["botId"]}) {
       assignable {
         ... on Issue {
           id
           title
           assignees(first: 10) {
             nodes { login }
           }
         }
       }
     }
   }
   ```

### Requirements

- Repository must have Copilot coding agent enabled
- Workflow must authenticate with a user token (personal access token or GitHub App user-to-server token)
- The `copilot-swe-agent` must appear in the repository's suggested actors