export default function ColorType({ value, onChange }) {
    return (
        <div className="row mt-3">
            <div className="col-2">
                <label htmlFor="colorType" className="form-label">Type:</label>
            </div>
            <div className="col-10">
                <select 
                    className="form-select"
                    id="colorType"
                    value={value} 
                    onChange={onChange}
                >
                    <option value="rgb">RGB</option>
                    <option value="rgba">RGBA</option>
                    <option value="hex">HEX</option>
                </select>
            </div>
        </div>
    );
}