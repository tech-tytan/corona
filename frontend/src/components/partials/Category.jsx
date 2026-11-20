function Category({ category, categories }) {
    return (<select ref={category} className="form-control form-control-sm d-inline-block col-4">
        <option value="">Category</option>
        {(categories != undefined && categories.length > 0) ? categories.map((item, index) => <option key={item.index} value={item.index}>
            {item.category}
        </option>) : ""}
    </select>)
}

export default Category
