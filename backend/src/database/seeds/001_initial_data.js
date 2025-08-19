import bcrypt from 'bcryptjs';
import { db } from '../connection.js';

export async function seed(knex) {
  // Clear existing data
  await knex('audit_logs').del();
  await knex('ai_analyses').del();
  await knex('documents').del();
  await knex('records').del();
  await knex('users').del();
  await knex('institutions').del();

  // Create institutions
  const institutions = [
    {
      name: 'Addis Ababa City Administration',
      type: 'government',
      code: 'AACA001',
      address: 'Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      country: 'Ethiopia',
      phone: '+251-11-123-4567',
      email: 'info@aaca.gov.et',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Tikur Anbessa Specialized Hospital',
      type: 'health_institution',
      code: 'TASH001',
      address: 'Lideta, Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      country: 'Ethiopia',
      phone: '+251-11-123-4568',
      email: 'info@tash.gov.et',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Federal Supreme Court',
      type: 'court',
      code: 'FSC001',
      address: 'Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      country: 'Ethiopia',
      phone: '+251-11-123-4569',
      email: 'info@fsc.gov.et',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Ethiopian Orthodox Tewahedo Church',
      type: 'religious_institution',
      code: 'EOTC001',
      address: 'Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      country: 'Ethiopia',
      phone: '+251-11-123-4570',
      email: 'info@eotc.org.et',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const [aacaId, tashId, fscId, eotcId] = await knex('institutions')
    .insert(institutions)
    .returning('id');

  // Create users
  const hashedPassword = await bcrypt.hash('Password123!', 12);
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@veims.gov.et',
      password_hash: hashedPassword,
      role: 'admin',
      index_number: 'ADM001',
      phone_number: '+251-91-123-4567',
      institution_name: 'Addis Ababa City Administration',
      institution_id: aacaId,
      department: 'IT',
      position: 'System Administrator',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'John Doe',
      email: 'john.doe@veims.gov.et',
      password_hash: hashedPassword,
      role: 'registrar',
      index_number: 'REG001',
      phone_number: '+251-91-123-4568',
      institution_name: 'Addis Ababa City Administration',
      institution_id: aacaId,
      department: 'Vital Statistics',
      position: 'Senior Registrar',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@tash.gov.et',
      password_hash: hashedPassword,
      role: 'health_institution',
      index_number: 'HEA001',
      phone_number: '+251-91-123-4569',
      institution_name: 'Tikur Anbessa Specialized Hospital',
      institution_id: tashId,
      department: 'Obstetrics',
      position: 'Medical Director',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Judge Michael Chen',
      email: 'michael.chen@fsc.gov.et',
      password_hash: hashedPassword,
      role: 'court',
      index_number: 'COU001',
      phone_number: '+251-91-123-4570',
      institution_name: 'Federal Supreme Court',
      institution_id: fscId,
      department: 'Family Court',
      position: 'Presiding Judge',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Father Abebe Kebede',
      email: 'abebe.kebede@eotc.org.et',
      password_hash: hashedPassword,
      role: 'religious_institution',
      index_number: 'REL001',
      phone_number: '+251-91-123-4571',
      institution_name: 'Ethiopian Orthodox Tewahedo Church',
      institution_id: eotcId,
      department: 'Religious Affairs',
      position: 'Senior Priest',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Office Manager',
      email: 'manager@veims.gov.et',
      password_hash: hashedPassword,
      role: 'office_manager',
      index_number: 'MGR001',
      phone_number: '+251-91-123-4572',
      institution_name: 'Addis Ababa City Administration',
      institution_id: aacaId,
      department: 'Administration',
      position: 'Office Manager',
      is_active: true,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const [adminId, registrarId, healthId, courtId, religiousId, managerId] = await knex('users')
    .insert(users)
    .returning('id');

  // Create sample records
  const records = [
    {
      record_number: 'BR-2024-001',
      type: 'birth',
      status: 'approved',
      registrar_id: registrarId,
      institution_id: tashId,
      submission_date: '2024-01-15',
      event_date: '2024-01-10',
      location: 'Tikur Anbessa Specialized Hospital, Addis Ababa',
      data: {
        child_name: 'Alemayehu Tadesse',
        gender: 'male',
        birth_weight: '3.2kg',
        mother_name: 'Tigist Haile',
        father_name: 'Tadesse Alemu',
        birth_time: '14:30',
        delivery_method: 'natural'
      },
      documents: ['birth_certificate.pdf'],
      verification_data: {
        verified_by: 'Dr. Sarah Johnson',
        verification_date: '2024-01-15',
        verification_method: 'document_review'
      },
      ai_analysis: {
        fraud_risk: 'low',
        confidence: 0.95,
        analysis_date: '2024-01-15'
      },
      notes: 'Normal delivery, healthy baby',
      reviewed_by: managerId,
      reviewed_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      record_number: 'MR-2024-001',
      type: 'marriage',
      status: 'pending',
      registrar_id: religiousId,
      institution_id: eotcId,
      submission_date: '2024-01-20',
      event_date: '2024-01-18',
      location: 'Ethiopian Orthodox Tewahedo Church, Addis Ababa',
      data: {
        groom_name: 'Dawit Mengistu',
        bride_name: 'Bethel Solomon',
        groom_age: 28,
        bride_age: 25,
        marriage_type: 'religious',
        witnesses: ['Abebe Kebede', 'Tigist Haile']
      },
      documents: ['marriage_license.pdf', 'church_certificate.pdf'],
      verification_data: {
        verified_by: 'Father Abebe Kebede',
        verification_date: '2024-01-20',
        verification_method: 'personal_attendance'
      },
      ai_analysis: {
        fraud_risk: 'low',
        confidence: 0.92,
        analysis_date: '2024-01-20'
      },
      notes: 'Traditional Ethiopian Orthodox ceremony',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      record_number: 'DR-2024-001',
      type: 'death',
      status: 'approved',
      registrar_id: healthId,
      institution_id: tashId,
      submission_date: '2024-01-25',
      event_date: '2024-01-23',
      location: 'Tikur Anbessa Specialized Hospital, Addis Ababa',
      data: {
        deceased_name: 'Mulugeta Haile',
        age: 75,
        gender: 'male',
        cause_of_death: 'Natural causes - old age',
        place_of_death: 'Hospital',
        next_of_kin: 'Haile Mulugeta'
      },
      documents: ['death_certificate.pdf', 'medical_report.pdf'],
      verification_data: {
        verified_by: 'Dr. Sarah Johnson',
        verification_date: '2024-01-25',
        verification_method: 'medical_documentation'
      },
      ai_analysis: {
        fraud_risk: 'low',
        confidence: 0.98,
        analysis_date: '2024-01-25'
      },
      notes: 'Peaceful passing, family notified',
      reviewed_by: managerId,
      reviewed_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const [birthRecordId, marriageRecordId, deathRecordId] = await knex('records')
    .insert(records)
    .returning('id');

  // Create sample documents
  const documents = [
    {
      filename: 'birth_certificate.pdf',
      original_name: 'birth_certificate.pdf',
      file_path: '/uploads/birth_certificate.pdf',
      file_type: 'pdf',
      file_size: 1024000,
      mime_type: 'application/pdf',
      record_id: birthRecordId,
      uploaded_by: registrarId,
      document_type: 'birth_certificate',
      is_verified: true,
      verification_status: 'verified',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      filename: 'marriage_license.pdf',
      original_name: 'marriage_license.pdf',
      file_path: '/uploads/marriage_license.pdf',
      file_type: 'pdf',
      file_size: 512000,
      mime_type: 'application/pdf',
      record_id: marriageRecordId,
      uploaded_by: religiousId,
      document_type: 'marriage_license',
      is_verified: true,
      verification_status: 'verified',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      filename: 'death_certificate.pdf',
      original_name: 'death_certificate.pdf',
      file_path: '/uploads/death_certificate.pdf',
      file_type: 'pdf',
      file_size: 768000,
      mime_type: 'application/pdf',
      record_id: deathRecordId,
      uploaded_by: healthId,
      document_type: 'death_certificate',
      is_verified: true,
      verification_status: 'verified',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await knex('documents').insert(documents);

  // Create sample AI analyses
  const aiAnalyses = [
    {
      record_id: birthRecordId,
      analysis_type: 'fraud_detection',
      model_used: 'openai',
      model_version: 'gpt-4',
      input_data: { record_type: 'birth', data: records[0].data },
      output_data: {
        fraud_risk: 'low',
        confidence: 0.95,
        indicators: [],
        recommendations: ['Proceed with approval']
      },
      confidence_scores: { overall: 0.95, fraud_detection: 0.92 },
      overall_confidence: 0.95,
      status: 'completed',
      processing_time_ms: 2500,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      record_id: marriageRecordId,
      analysis_type: 'document_analysis',
      model_used: 'openai',
      model_version: 'gpt-4',
      input_data: { record_type: 'marriage', data: records[1].data },
      output_data: {
        extracted_data: {
          names: ['Dawit Mengistu', 'Bethel Solomon'],
          dates: ['2024-01-18'],
          locations: ['Addis Ababa']
        },
        confidence: 0.92,
        quality_score: 0.89
      },
      confidence_scores: { overall: 0.92, extraction: 0.89 },
      overall_confidence: 0.92,
      status: 'completed',
      processing_time_ms: 1800,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await knex('ai_analyses').insert(aiAnalyses);

  // Create sample audit logs
  const auditLogs = [
    {
      user_id: adminId,
      action: 'create',
      resource_type: 'user',
      resource_id: registrarId,
      resource_identifier: 'john.doe@veims.gov.et',
      new_values: { name: 'John Doe', role: 'registrar' },
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      created_at: new Date()
    },
    {
      user_id: registrarId,
      action: 'create',
      resource_type: 'record',
      resource_id: birthRecordId,
      resource_identifier: 'BR-2024-001',
      new_values: { type: 'birth', status: 'pending' },
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      created_at: new Date()
    },
    {
      user_id: managerId,
      action: 'update',
      resource_type: 'record',
      resource_id: birthRecordId,
      resource_identifier: 'BR-2024-001',
      old_values: { status: 'pending' },
      new_values: { status: 'approved' },
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      created_at: new Date()
    }
  ];

  await knex('audit_logs').insert(auditLogs);

  console.log('✅ Database seeded successfully!');
  console.log('📊 Sample data created:');
  console.log(`   - ${institutions.length} institutions`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${records.length} records`);
  console.log(`   - ${documents.length} documents`);
  console.log(`   - ${aiAnalyses.length} AI analyses`);
  console.log(`   - ${auditLogs.length} audit logs`);
  console.log('');
  console.log('🔑 Default login credentials:');
  console.log('   Email: admin@veims.gov.et');
  console.log('   Password: Password123!');
  console.log('');
  console.log('🌐 Other test accounts:');
  console.log('   - john.doe@veims.gov.et (registrar)');
  console.log('   - sarah.johnson@tash.gov.et (health_institution)');
  console.log('   - michael.chen@fsc.gov.et (court)');
  console.log('   - abebe.kebede@eotc.org.et (religious_institution)');
  console.log('   - manager@veims.gov.et (office_manager)');
  console.log('   All accounts use the same password: Password123!');
}

export async function unseed(knex) {
  // Remove all data in reverse order
  await knex('audit_logs').del();
  await knex('ai_analyses').del();
  await knex('documents').del();
  await knex('records').del();
  await knex('users').del();
  await knex('institutions').del();
  
  console.log('🗑️  Database unseeded successfully!');
}
