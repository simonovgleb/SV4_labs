import React from 'react';
import initialDishes from '../../data/dishes.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel } from "docx";

export class ManageDishes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: [],
            selectedDish: null,
            showModal: false,
            selectedIds: [],
            dishForm: {
                id: null,
                name: '',
                description: '',
                category: '',
                price: ''
            },
            isEditing: false,
            searchQuery: '',
            filterCategory: '',
            currentPage: 1,
            itemsPerPage: 10
        };
    }

    componentDidMount() {
        this.setState({ dishes: initialDishes });
    }

    openModal = (dish) => {
        this.setState({ selectedDish: dish, showModal: true });
    };

    closeModal = () => {
        this.setState({ showModal: false, selectedDish: null, isEditing: false });
    };

    handleSelectToggle = (id) => {
        this.setState((prevState) => {
            const { selectedIds } = prevState;
            return selectedIds.includes(id)
                ? { selectedIds: selectedIds.filter(sid => sid !== id) }
                : { selectedIds: [...selectedIds, id] };
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            dishForm: {
                ...prevState.dishForm,
                [name]: value
            }
        }));
    };

    handleAddOrUpdateDish = () => {
        const { dishForm, isEditing, dishes } = this.state;
        if (isEditing) {
            this.setState({
                dishes: dishes.map(d => d.id === dishForm.id ? { ...dishForm, price: parseFloat(dishForm.price) } : d),
                dishForm: { id: null, name: '', description: '', category: '', price: '' },
                isEditing: false
            });
        } else {
            const newDish = { ...dishForm, id: new Date().getTime(), price: parseFloat(dishForm.price) };
            this.setState({
                dishes: [...dishes, newDish],
                dishForm: { id: null, name: '', description: '', category: '', price: '' }
            });
        }
    };

    handleEditClick = (dish) => {
        this.setState({
            dishForm: { ...dish },
            isEditing: true
        });
    };

    handleDeleteSelected = () => {
        this.setState(prevState => ({
            dishes: prevState.dishes.filter(d => !prevState.selectedIds.includes(d.id)),
            selectedIds: []
        }));
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value, currentPage: 1 });
    };

    handleFilterCategoryChange = (e) => {
        this.setState({ filterCategory: e.target.value, currentPage: 1 });
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    handleGenerateReport = async () => {
        const { dishes, searchQuery, filterCategory } = this.state;

        const filteredDishes = dishes.filter(dish => {
            const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory ? dish.category === filterCategory : true;
            return matchesSearch && matchesCategory;
        });

        const tableRows = [];

        tableRows.push(new TableRow({
            children: [
                new TableCell({ children: [new Paragraph("Name")] }),
                new TableCell({ children: [new Paragraph("Category")] }),
                new TableCell({ children: [new Paragraph("Price")] }),
            ]
        }));

        filteredDishes.forEach(dish => {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(dish.name)] }),
                    new TableCell({ children: [new Paragraph(dish.category)] }),
                    new TableCell({ children: [new Paragraph(`$${dish.price.toFixed(2)}`)] }),
                ]
            }));
        });

        const table = new Table({ rows: tableRows });
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({ text: "Dishes Report", heading: HeadingLevel.HEADING_1 }),
                    table
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "DishesReport.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    render() {
        const { dishes, selectedIds, dishForm, isEditing, showModal, selectedDish, searchQuery, filterCategory, currentPage, itemsPerPage } = this.state;

        const categories = [...new Set(dishes.map(d => d.category))];

        // Фильтрация блюд по поиску и категории
        const filteredDishes = dishes.filter(dish => {
            const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory ? dish.category === filterCategory : true;
            return matchesSearch && matchesCategory;
        });

        // Расчёт пагинации
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentDishes = filteredDishes.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

        return (
            <div className="container py-5">
                <h2 className="text-center mb-4">Manage Dishes</h2>

                {/* Форма добавления/редактирования блюда */}
                <div className="card mb-5">
                    <div className="card-header">
                        <h5 className="mb-0">{isEditing ? 'Edit Dish' : 'Add New Dish'}</h5>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={dishForm.name}
                                    onChange={this.handleInputChange}
                                    placeholder="Dish Name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    value={dishForm.description}
                                    onChange={this.handleInputChange}
                                    placeholder="Description"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    value={dishForm.category}
                                    onChange={this.handleInputChange}
                                    placeholder="Category"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={dishForm.price}
                                    onChange={this.handleInputChange}
                                    placeholder="Price"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.handleAddOrUpdateDish}
                            >
                                {isEditing ? 'Update Dish' : 'Add Dish'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Поле поиска и фильтрации */}
                <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={filterCategory}
                            onChange={this.handleFilterCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Список блюд */}
                <h3 className="mb-3">Dishes List</h3>
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDishes.map(dish => (
                            <tr
                                key={dish.id}
                                className={selectedIds.includes(dish.id) ? 'table-info' : ''}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(dish.id)}
                                        onChange={() => this.handleSelectToggle(dish.id)}
                                    />
                                </td>
                                <td>{dish.name}</td>
                                <td>{dish.category}</td>
                                <td>${dish.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => this.openModal(dish)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => this.handleEditClick(dish)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Пагинация */}
                {totalPages > 1 && (
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => this.handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* Кнопка массового удаления и создания отчёта */}
                <button
                    className="btn btn-danger"
                    onClick={this.handleDeleteSelected}
                    disabled={!selectedIds.length}
                >
                    Delete Selected
                </button>
                <button
                    className="btn btn-success ms-2"
                    onClick={this.handleGenerateReport}
                >
                    Generate Report (docx)
                </button>

                {/* Модальное окно */}
                {showModal && selectedDish && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" onClick={this.closeModal}>
                        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedDish.name}</h5>
                                    <button type="button" className="btn-close" onClick={this.closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Description:</strong> {selectedDish.description}</p>
                                    <p><strong>Category:</strong> {selectedDish.category}</p>
                                    <p><strong>Price:</strong> ${selectedDish.price.toFixed(2)}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
