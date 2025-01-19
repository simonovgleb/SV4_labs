// src/components/ManageReservations.js
import React from 'react';
import initialReservations from '../../data/reservations.json';
import './ManageReservations.css';

export class ManageReservations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            selectedReservation: null,
            showModal: false,
            selectedIds: [],
            reservationForm: {
                id: null,
                name: '',
                date: '',
                time: '',
                guests: '',
                requests: ''
            },
            isEditing: false
        };
    }

    componentDidMount() {
        this.setState({ reservations: initialReservations });
    }

    openModal = (reservation) => {
        this.setState({ selectedReservation: reservation, showModal: true });
    };

    closeModal = () => {
        this.setState({ showModal: false, selectedReservation: null, isEditing: false });
    };

    handleSelectToggle = (id) => {
        this.setState(prevState => {
            const { selectedIds } = prevState;
            return selectedIds.includes(id)
                ? { selectedIds: selectedIds.filter(sid => sid !== id) }
                : { selectedIds: [...selectedIds, id] };
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            reservationForm: {
                ...prevState.reservationForm,
                [name]: value
            }
        }));
    };

    handleAddOrUpdateReservation = () => {
        const { reservationForm, isEditing, reservations } = this.state;
        if (isEditing) {
            this.setState({
                reservations: reservations.map(r =>
                    r.id === reservationForm.id ? { ...reservationForm } : r
                ),
                reservationForm: { id: null, name: '', date: '', time: '', guests: '', requests: '' },
                isEditing: false
            });
        } else {
            const newReservation = { ...reservationForm, id: new Date().getTime() };
            this.setState({
                reservations: [...reservations, newReservation],
                reservationForm: { id: null, name: '', date: '', time: '', guests: '', requests: '' }
            });
        }
    };

    handleEditClick = (reservation) => {
        this.setState({
            reservationForm: { ...reservation },
            isEditing: true
        });
    };

    handleDeleteSelected = () => {
        this.setState(prevState => ({
            reservations: prevState.reservations.filter(
                r => !prevState.selectedIds.includes(r.id)
            ),
            selectedIds: []
        }));
    };

    render() {
        const {
            reservations,
            selectedIds,
            reservationForm,
            isEditing,
            showModal,
            selectedReservation
        } = this.state;

        return (
            <section className="manage-reservations">
                <h2>Reservations</h2>
                <div className="reservations__content">
                    {/* Форма бронирования */}
                    <div className="form-container reservation-form">
                        <h3 className="subheading">
                            {isEditing ? 'Edit Reservation' : 'Add New Reservation'}
                        </h3>
                        <input
                            type="text"
                            name="name"
                            value={reservationForm.name}
                            onChange={this.handleInputChange}
                            placeholder="Name"
                            title="Введите имя"
                        />
                        <input
                            type="date"
                            name="date"
                            value={reservationForm.date}
                            onChange={this.handleInputChange}
                            placeholder="Date"
                            title="Выберите дату"
                        />
                        <input
                            type="time"
                            name="time"
                            value={reservationForm.time}
                            onChange={this.handleInputChange}
                            placeholder="Time"
                            title="Выберите время"
                        />
                        <input
                            type="number"
                            name="guests"
                            value={reservationForm.guests}
                            onChange={this.handleInputChange}
                            placeholder="Number of Guests"
                            title="Количество гостей"
                        />
                        <input
                            type="text"
                            name="requests"
                            value={reservationForm.requests}
                            onChange={this.handleInputChange}
                            placeholder="Special Requests"
                            title="Особые запросы"
                        />
                        <button onClick={this.handleAddOrUpdateReservation}>
                            {isEditing ? 'Update Reservation' : 'Add Reservation'}
                        </button>
                    </div>

                    {/* Список бронирований */}
                    <div className="reservations-list">
                        <h3 className="subheading">Reservations List</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Guests</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(reservation => (
                                    <tr
                                        key={reservation.id}
                                        style={{
                                            backgroundColor: selectedIds.includes(reservation.id)
                                                ? '#e0f7fa'
                                                : 'transparent'
                                        }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(reservation.id)}
                                                onChange={() => this.handleSelectToggle(reservation.id)}
                                                title="Выбрать бронирование"
                                            />
                                        </td>
                                        <td>{reservation.name}</td>
                                        <td>{reservation.date}</td>
                                        <td>{reservation.time}</td>
                                        <td>{reservation.guests}</td>
                                        <td>
                                            <button
                                                className="actionButton viewButton"
                                                onClick={() => this.openModal(reservation)}
                                                title="Просмотреть детали"
                                            >
                                                View
                                            </button>
                                            <button
                                                className="actionButton editButton"
                                                onClick={() => this.handleEditClick(reservation)}
                                                title="Редактировать бронирование"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Кнопка массового удаления */}
                        <button
                            className="deleteButton"
                            onClick={this.handleDeleteSelected}
                            disabled={!selectedIds.length}
                            title="Удалить выбранные бронирования"
                        >
                            Delete Selected
                        </button>
                    </div>
                </div>

                {/* Модальное окно с деталями бронирования */}
                {showModal && selectedReservation && (
                    <div className="modal-overlay" onClick={this.closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Reservation Details</h3>
                            <p><strong>Name:</strong> {selectedReservation.name}</p>
                            <p><strong>Date:</strong> {selectedReservation.date}</p>
                            <p><strong>Time:</strong> {selectedReservation.time}</p>
                            <p><strong>Guests:</strong> {selectedReservation.guests}</p>
                            <p><strong>Special Requests:</strong> {selectedReservation.requests}</p>
                            <button onClick={this.closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </section>
        );
    }
}
