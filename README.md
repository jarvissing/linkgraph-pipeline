**Automated Content Publishing Pipeline**

**Overview**
Manual content publishing often introduces human error and significant latency. This project eliminates the bottlenecks associated with manual CMS uploads by deploying an automated agent that manages the entire workflow, from markdown file ingestion to live publication.

**Technology Stack**
*   **Language:** JavaScript (Node.js)
*   **Automation Framework:** Playwright (Headless Browser)
*   **Infrastructure:** GitHub Actions (CI/CD)
*   **Quality Assurance:** Custom regex-based content validation layer
*   **Version Control:** Git

**Operational Workflow**
The pipeline executes a strict, error-resistant sequence:
1.  **Validation:** Scans raw markdown for prohibited phrases, such as AI-disclaimer markers, prior to processing.
2.  **Parsing:** Converts validated markdown into clean, CMS-ready HTML using the `marked` library.
3.  **Injection:** Bypasses CMS UI restrictions (e.g., `contenteditable="false"`) through direct DOM manipulation via `page.evaluate()`.
4.  **Action:** Initiates UI-based "Publish" sequences using resilient accessibility locators and forced click events.
5.  **Verification:** Generates a `final-proof.png` artifact to provide visual confirmation of successful deployment.

**Engineering Challenges and Solutions**
*   **CMS UI "Read-Only" Locks:** Resolved by utilizing `page.evaluate()` to perform direct DOM injection, effectively bypassing UI restrictions.
*   **Fragmented Selectors:** Addressed by migrating from unstable role-based selectors to text-based locators with `{force: true}` settings to ensure interaction reliability.
  
*   **Temporary Cloud Environment:**
*    Solved by implementing `GitHub Actions upload-artifact` to persist deployment screenshots for remote verification.
    
     **Proof of Execution Guide for Local Execution**
1. Clone the repository: git clone (https://github.com/jarvissing/linkgraph-pipeline )
2. Install dependencies: npm install
3. Run the pipeline: node publish.js
