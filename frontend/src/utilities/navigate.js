export function lastPosition(queries, navigate, destination, e) {
    e.preventDefault();
    localStorage.setItem("last_position", JSON.stringify(queries.current));
    navigate(destination);
}
