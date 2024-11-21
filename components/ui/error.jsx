export function Error({ error, touched }) {
    if (!touched || !error) return null;
    return (
        <p className="mt-2 text-xs text-red-600">
            {error}
        </p>
    );
}