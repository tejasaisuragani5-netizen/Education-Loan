-- PostgreSQL Production Schema for Education Loan Support Agent
-- Production: DATABASE_URL=postgresql://postgres:password@localhost:5432/eduloan_prod

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    admission_year VARCHAR(64) NOT NULL,
    total_fee NUMERIC(12, 2) NOT NULL,
    is_loan_dependent INTEGER DEFAULT 0,
    loan_bank VARCHAR(255) DEFAULT '',
    sanctioned_amount NUMERIC(12, 2) DEFAULT 0,
    loan_status VARCHAR(64) DEFAULT 'Not Applicable',
    paid_fee NUMERIC(12, 2) DEFAULT 0,
    current_hold_status VARCHAR(64) DEFAULT 'None',
    current_hold_amount NUMERIC(12, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS document_requests (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    description TEXT,
    request_date VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    issued_date VARCHAR(64),
    approval_date VARCHAR(64),
    turnaround_hours NUMERIC(6, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    request_id INTEGER,
    student_id VARCHAR(64) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    verification_code VARCHAR(64) UNIQUE NOT NULL,
    issued_date VARCHAR(64) NOT NULL,
    file_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS disbursements (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    loan_amount NUMERIC(12, 2) NOT NULL,
    disbursed_date VARCHAR(64) NOT NULL,
    reconciled INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    utr_number VARCHAR(128) DEFAULT '',
    academic_term VARCHAR(64) DEFAULT 'Full Year'
);

CREATE TABLE IF NOT EXISTS verification_requests (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    ai_verdict VARCHAR(64) NOT NULL,
    confidence NUMERIC(6, 2) NOT NULL DEFAULT 0,
    ai_reason TEXT,
    extracted_text TEXT,
    ai_engine VARCHAR(128) DEFAULT 'Built-in Verification Agent',
    status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    created_at VARCHAR(64) NOT NULL,
    scorecard_json TEXT,
    request_id INTEGER
);

CREATE TABLE IF NOT EXISTS bundle_eligibility_evaluations (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    overall_verdict VARCHAR(64) NOT NULL,
    eligibility_score NUMERIC(6, 2) NOT NULL,
    target_loan_amount NUMERIC(12, 2) DEFAULT 0,
    family_income NUMERIC(12, 2) DEFAULT 0,
    documents_summary_json TEXT,
    cross_doc_identity_json TEXT,
    scheme_eligibility_json TEXT,
    discrepancies_json TEXT,
    dossier_pdf_path TEXT,
    created_at VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    action TEXT NOT NULL,
    document_id VARCHAR(128),
    timestamp VARCHAR(64) NOT NULL,
    result TEXT,
    ip_session VARCHAR(128)
);
