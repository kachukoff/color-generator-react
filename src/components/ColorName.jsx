export default function ColorName({ value, onChange, error, placeholder }) {
    return (
        <div className="row mt-3">
            <div className="col-2">
                <label htmlFor="colorName" className="form-label">Color:</label>
            </div>
            <div className="col-10">
                <input
                    type="text"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="colorName"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    );
}