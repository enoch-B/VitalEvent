export function up(knex) {
  return knex.schema.createTable('ai_analyses', (table) => {
    table.increments('id').primary();
    table.integer('record_id').unsigned().references('id').inTable('records');
    table.integer('document_id').unsigned().references('id').inTable('documents');
    table.string('analysis_type', 100).notNullable(); // ocr, classification, fraud_detection, etc.
    table.string('model_used', 100).notNullable();
    table.string('model_version', 50);
    table.json('input_data'); // Input data sent to AI model
    table.json('output_data'); // AI model output
    table.json('confidence_scores'); // Confidence scores for predictions
    table.float('overall_confidence');
    table.string('status', 50).defaultTo('completed'); // pending, processing, completed, failed
    table.string('error_message', 500);
    table.integer('processing_time_ms'); // Time taken for processing
    table.json('metadata'); // Additional analysis metadata
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['record_id']);
    table.index(['document_id']);
    table.index(['analysis_type']);
    table.index(['status']);
    table.index(['model_used']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('ai_analyses');
}
