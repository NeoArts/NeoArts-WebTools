# Document Analysis API Guide

This guide covers the Document Analysis functionality of the Meeting Agent API, which processes various document types and generates GitHub Copilot prompts based on extracted requirements.

## 🎯 Overview

The Document Analysis service can:
- **Process multiple file formats**: XLSX, XLS, PDF, DOCX, MD, TXT
- **Extract user stories**: Convert requirements into proper user story format
- **Classify development type**: Categorize as new feature, bug fix, enhancement, etc.
- **Generate GitHub Copilot prompts**: Create structured prompts for code generation

## 📋 Supported File Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| Excel | .xlsx, .xls | Spreadsheets with requirements, user stories, or specifications |
| PDF | .pdf | PDF documents with project requirements or technical specs |
| Word | .docx | Word documents with detailed requirements |
| Markdown | .md | Markdown files with project documentation |
| Text | .txt | Plain text files with requirements |

## 🔧 API Endpoints

### 1. Analyze Document
**POST /documents/analyze**

Upload and analyze a document to extract user stories and generate GitHub Copilot prompts.

**Request:**
- **Content-Type**: multipart/form-data
- **File Parameter**: `file` (required)

**Example using cURL:**
```bash
curl -X POST "http://localhost:8000/documents/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@requirements.pdf"
```

**Response:**
```json
{
  "user_stories": [
    "As a user, I want to be able to log in to the system so that I can access my personal dashboard",
    "As an admin, I want to manage user permissions so that I can control access to sensitive features"
  ],
  "development_type": "new_feature",
  "summary": "User authentication and authorization system with role-based access control",
  "github_copilot_prompt": "# New Feature Request\n\n## Summary\nUser authentication and authorization system...",
  "confidence_score": 0.89,
  "error": null
}
```

**Response Fields:**
- `user_stories`: Array of extracted user stories in proper format
- `development_type`: Classification (new_feature, bug_fix, enhancement, refactoring, maintenance)
- `summary`: Brief summary of the requirements
- `github_copilot_prompt`: Ready-to-use prompt for GitHub Copilot
- `confidence_score`: AI confidence in the analysis (0.0-1.0)
- `error`: Error message if processing failed

### 2. Get Supported Formats
**GET /documents/supported-formats**

Get information about supported file formats.

**Response:**
```json
{
  "supported_formats": [".xlsx", ".xls", ".pdf", ".docx", ".md", ".txt"],
  "description": "Upload documents in any of these formats for analysis",
  "examples": {
    ".xlsx/.xls": "Excel spreadsheets with requirements, user stories, or specifications",
    ".pdf": "PDF documents with project requirements or specifications",
    ".docx": "Word documents with detailed requirements",
    ".md": "Markdown files with project documentation",
    ".txt": "Plain text files with requirements"
  }
}
```

### 3. Service Information
**GET /documents/**

Get general information about the document analysis service.

## 💻 Client Implementation Examples

### Python Client
```python
import requests

def analyze_document(file_path):
    """Analyze a document and get GitHub Copilot prompt."""
    url = "http://localhost:8000/documents/analyze"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Request failed: {response.status_code}"}

# Usage
result = analyze_document("requirements.pdf")
print(result['github_copilot_prompt'])
```

### JavaScript/Node.js Client
```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function analyzeDocument(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    const response = await fetch('http://localhost:8000/documents/analyze', {
        method: 'POST',
        body: form
    });
    
    return await response.json();
}

// Usage
analyzeDocument('./requirements.docx')
    .then(result => console.log(result.github_copilot_prompt));
```

### cURL Examples
```bash
# Analyze a PDF document
curl -X POST "http://localhost:8000/documents/analyze" \
  -F "file=@project-requirements.pdf"

# Analyze an Excel file
curl -X POST "http://localhost:8000/documents/analyze" \
  -F "file=@user-stories.xlsx"

# Analyze a Word document
curl -X POST "http://localhost:8000/documents/analyze" \
  -F "file=@specification.docx"

# Get supported formats
curl "http://localhost:8000/documents/supported-formats"
```

## 📝 Development Types

The service classifies requirements into these categories:

| Type | Description | Example |
|------|-------------|---------|
| `new_feature` | Completely new functionality | Adding user authentication system |
| `bug_fix` | Fixing existing issues | Resolving login error on mobile devices |
| `enhancement` | Improving existing features | Adding password strength indicator |
| `refactoring` | Code improvement without new features | Restructuring authentication module |
| `maintenance` | Updates, upgrades, routine changes | Updating dependencies, security patches |

## 🎯 User Story Format

The service extracts and formats user stories following the standard template:

```
As a [user type], I want [functionality] so that [benefit]
```

**Examples:**
- "As a customer, I want to reset my password so that I can regain access to my account"
- "As an administrator, I want to view user activity logs so that I can monitor system usage"
- "As a developer, I want API documentation so that I can integrate with the system"

## 📊 GitHub Copilot Prompt Structure

The generated prompts follow this structure:

```markdown
# [Development Type] Request

## Summary
[Brief description of the requirements]

## User Stories
1. As a [user], I want [feature] so that [benefit]
2. As a [user], I want [feature] so that [benefit]

## Key Requirements
- Specific requirement 1
- Specific requirement 2

## Instructions for GitHub Copilot
Please implement the above requirements following these guidelines:
- Analyze the current project structure and codebase
- Follow existing code patterns and conventions
- Ensure compatibility with the current technology stack
- Implement proper error handling and validation
- Add appropriate tests if testing framework is present
- Follow security best practices
- Maintain code quality and readability

Focus on the functional requirements described in the user stories above.
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Unsupported File Format**
```json
{
  "error": "Unsupported file format",
  "message": "File 'document.xyz' has an unsupported format",
  "supported_formats": [".xlsx", ".xls", ".pdf", ".docx", ".md", ".txt"]
}
```

2. **Empty or Unreadable File**
```json
{
  "user_stories": [],
  "development_type": "new_feature",
  "summary": "",
  "github_copilot_prompt": "",
  "confidence_score": 0.0,
  "error": "Could not extract text from document"
}
```

3. **Processing Failed**
```json
{
  "error": "Processing failed",
  "message": "Failed to process document: [specific error]",
  "supported_formats": [".xlsx", ".xls", ".pdf", ".docx", ".md", ".txt"]
}
```

## 💡 Best Practices

### Document Preparation
1. **Clear Structure**: Organize requirements in clear sections
2. **Specific Language**: Use concrete, actionable language
3. **Complete Information**: Include context and acceptance criteria
4. **Consistent Format**: Use similar structures across documents

### File Format Tips
- **Excel**: Use separate sheets for different requirement types
- **PDF**: Ensure text is selectable (not just images)
- **Word**: Use headings and bullet points for structure
- **Markdown**: Follow standard markdown conventions

### Usage Recommendations
1. **Review Results**: Always review the generated user stories for accuracy
2. **Iterate**: Use the confidence score to determine if additional clarification is needed
3. **Combine Sources**: Analyze multiple documents for comprehensive requirements
4. **Validate**: Cross-check extracted requirements with stakeholders

## 🔄 Integration Workflow

Typical workflow for using the document analysis service:

1. **Upload Document** → POST /documents/analyze
2. **Review Results** → Check user stories and confidence score
3. **Refine if Needed** → Upload additional documents or clarify requirements
4. **Use Copilot Prompt** → Copy the generated prompt to GitHub Copilot
5. **Implement** → Let GitHub Copilot generate code based on the prompt

## 📈 Performance Notes

- **Processing Time**: Varies by document size and complexity (typically 5-30 seconds)
- **File Size Limits**: No hard limits set, but larger files take longer to process
- **Accuracy**: Higher confidence scores indicate more reliable extraction
- **Language Support**: Optimized for English content
