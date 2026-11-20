function Footer() {
    const date = new Date();

    return (<>
        {/* partial:partials/_footer.html */}
        <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright &copy; CORONA {date.getFullYear()}</span>
            </div>
        </footer>
        {/* partial */}
    </>)
}

export default Footer
