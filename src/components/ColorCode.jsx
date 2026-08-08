export default function ColorCode({ value, onChange, error, placeholder }) {
    return (
        <div className="row mt-3">
            <div className="col-2">
                <label htmlFor="colorCode" className="form-label">Code:</label>
            </div>
            <div className="col-10">
                <input 
                    type="text" 
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="colorCode"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    );
}