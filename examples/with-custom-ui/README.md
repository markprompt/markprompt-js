# Custom UI

This example demonstrates an interactive chat interface that implements tool calls to display a custom UI component. When triggered, this UI allows users to select a project from a predefined list of options. Based on the user's selection, the AI agent dynamically adapts its responses and behavior to provide project-specific information.

## Configuration

### Tools

When the agent needs to identify which project a user is referring to, it can trigger a custom UI component through a tool call. This component presents users with a dropdown menu of available projects to select from.

To implement this functionality:

1. Add the tool definition shown below to your Markprompt dashboard settings
2. Enable the tool for your agent
3. The tool will automatically display the project selection UI when invoked

```json
{
  "name": "askForProjectId",
  "description": "Ask the user for their project id. Use this tool when the user has a question about a project and they haven't explicitly specified which one they are referring to."
}
```

### Agent instructions

Here are some sample instructions that can be set in the Markprompt dashboard to configure how the agent behaves based on project selection status. These instructions use Handlebars templating to conditionally display different prompts depending on whether a project has been selected through the project picker UI:

```
You are a helpful AI assistant from Acme.

## Project details

{{#if projectId}}
The user's project id is: {{projectId}}. The project name is {{projectName}}.

Never say something like "I'll need to use the project ID you've provided", or "Let me fetch that information for you."

{{else}}
## Project details

The user has not yet set their project id.

If the user asks a question about a project, use the `askForProjectId` tool to request a project selection. Only use the `askForProjectId` tool when absolutely necessary.

{{/if}}

Once the project id has been provided, you should respond with "Your project is called <project_name>".
```

## Running

Create a file named `.env` in the root of the project with the following values set:

```
VITE_PROJECT_API_KEY=...
VITE_ASSISTANT_ID=...
```

These values can be obtained in the Markprompt dashboard. Then install dependencies and run the server locally:

```bash
npm i
npm run dev
```
