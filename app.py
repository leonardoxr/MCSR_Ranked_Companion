from flask import Flask, render_template, request, send_file, session
import pandas as pd
import os
from io import BytesIO
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
app.secret_key = 'your-secret-key-here'  # Change this to a secure random key in production

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    if file:
        try:
            df = pd.read_csv(file)
            # Identify duplicates across all columns
            duplicates = df[df.duplicated(keep=False)]

            # Store duplicates in session for download
            # Convert DataFrame to CSV string and store in session
            if not duplicates.empty:
                duplicates_csv = duplicates.to_csv(index=False)
                session['duplicates_csv'] = duplicates_csv
                session['has_duplicates'] = True
            else:
                session['duplicates_csv'] = None
                session['has_duplicates'] = False

            return render_template('results.html',
                                   original_data=df.to_html(classes='table table-striped', index=False),
                                   duplicate_data=duplicates.to_html(classes='table table-striped', index=False) if not duplicates.empty else None,
                                   has_duplicates=not duplicates.empty)
        except Exception as e:
            return f"Error processing file: {e}", 500
    return "Something went wrong", 500

@app.route('/download_duplicates', methods=['GET'])
def download_duplicates():
    # Check if duplicates exist in session
    if not session.get('has_duplicates', False) or not session.get('duplicates_csv'):
        return "No duplicates available for download. Please upload a CSV file first.", 400
    
    # Retrieve duplicates CSV string from session
    duplicates_csv = session['duplicates_csv']
    
    # Create BytesIO object from CSV string
    output = BytesIO()
    output.write(duplicates_csv.encode('utf-8'))
    output.seek(0)
    
    # Send file for download
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name='duplicates.csv'
    )

if __name__ == '__main__':
    app.run(debug=True)

