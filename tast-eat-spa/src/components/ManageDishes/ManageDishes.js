// src/components/ManageDishes.js
import React from 'react';
import initialDishes from '../../data/dishes.json';
import './ManageDishes.css';

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
            isEditing: false
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

    render() {
        const { dishes, selectedIds, dishForm, isEditing, showModal, selectedDish } = this.state;

        return (
            <div className="manage-dishes">
                <h2>Manage Dishes</h2>

                {/* Форма добавления/редактирования блюда */}
                <div className="form-container">
                    <h3 className="subheading">{isEditing ? 'Edit Dish' : 'Add New Dish'}</h3>
                    <input
                        type="text"
                        name="name"
                        value={dishForm.name}
                        onChange={this.handleInputChange}
                        placeholder="Name"
                        title="Введите название блюда"
                    />
                    <input
                        type="text"
                        name="description"
                        value={dishForm.description}
                        onChange={this.handleInputChange}
                        placeholder="Description"
                        title="Введите описание блюда"
                    />
                    <input
                        type="text"
                        name="category"
                        value={dishForm.category}
                        onChange={this.handleInputChange}
                        placeholder="Category"
                        title="Введите категорию блюда"
                    />
                    <input
                        type="number"
                        name="price"
                        value={dishForm.price}
                        onChange={this.handleInputChange}
                        placeholder="Price"
                        step="0.01"
                        title="Введите цену блюда"
                    />
                    <button onClick={this.handleAddOrUpdateDish}>
                        {isEditing ? 'Update Dish' : 'Add Dish'}
                    </button>
                </div>

                {/* Список блюд */}
                <div className="dishes-list">
                    <h3 className="subheading">Dishes List</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dishes.map(dish => (
                                <tr
                                    key={dish.id}
                                    style={{
                                        backgroundColor: selectedIds.includes(dish.id) ? '#e0f7fa' : 'transparent'
                                    }}
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(dish.id)}
                                            onChange={() => this.handleSelectToggle(dish.id)}
                                            title="Выбрать блюдо"
                                        />
                                    </td>
                                    <td>{dish.name}</td>
                                    <td>{dish.category}</td>
                                    <td>{dish.price}</td>
                                    <td>
                                        <button
                                            className="actionButton viewButton"
                                            onClick={() => this.openModal(dish)}
                                            title="Просмотреть детали"
                                        >
                                            View
                                        </button>
                                        <button
                                            className="actionButton editButton"
                                            onClick={() => this.handleEditClick(dish)}
                                            title="Редактировать блюдо"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Кнопка массового удаления выбранных блюд */}
                    <button
                        className="deleteButton"
                        onClick={this.handleDeleteSelected}
                        disabled={!selectedIds.length}
                        title="Удалить выбранные блюда"
                    >
                        Delete Selected
                    </button>
                </div>

                {/* Модальное окно для просмотра деталей блюда */}
                {showModal && selectedDish && (
                    <div className="modal-overlay" onClick={this.closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>{selectedDish.name}</h3>
                            <p><strong>Description:</strong> {selectedDish.description}</p>
                            <p><strong>Category:</strong> {selectedDish.category}</p>
                            <p><strong>Price:</strong> {selectedDish.price}</p>
                            <button onClick={this.closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
