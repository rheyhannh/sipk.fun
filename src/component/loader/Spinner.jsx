export default function Spinner({ size, color }) {
    return (
        <span 
            style={{
                width: size ? size : '24px',
                height: size ? size : '24px',
                borderTop: color ? `3px solid ${color}` : '3px solid var(--infoDark-color)'
            }}
            className="spinner"
            >
        </span>
    )
}