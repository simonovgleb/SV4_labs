import React from 'react';
import initialReservations from '../../data/reservations.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel } from "docx";

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
            isEditing: false,
            searchQuery: '',
            filterDate: '',
            currentPage: 1,
            itemsPerPage: 10
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
        this.setState((prevState) => {
            const { selectedIds } = prevState;
            return selectedIds.includes(id)
                ? { selectedIds: selectedIds.filter(sid => sid !== id) }
                : { selectedIds: [...selectedIds, id] };
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
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
                reservations: reservations.map((r) =>
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
        this.setState((prevState) => ({
            reservations: prevState.reservations.filter(
                (r) => !prevState.selectedIds.includes(r.id)
            ),
            selectedIds: []
        }));
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value, currentPage: 1 });
    };

    handleFilterDateChange = (e) => {
        this.setState({ filterDate: e.target.value, currentPage: 1 });
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    handleGenerateReport = async () => {
        const { reservations, searchQuery, filterDate } = this.state;

        // Фильтрация бронирований по имени и дате
        const filteredReservations = reservations.filter(reservation => {
            const matchesSearch = reservation.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDate = filterDate ? reservation.date === filterDate : true;
            return matchesSearch && matchesDate;
        });

        const tableRows = [];

        // Заголовок таблицы
        tableRows.push(new TableRow({
            children: [
                new TableCell({ children: [new Paragraph("Name")] }),
                new TableCell({ children: [new Paragraph("Date")] }),
                new TableCell({ children: [new Paragraph("Time")] }),
                new TableCell({ children: [new Paragraph("Guests")] }),
                new TableCell({ children: [new Paragraph("Requests")] }),
            ]
        }));

        // Строки данных
        filteredReservations.forEach(reservation => {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(reservation.name)] }),
                    new TableCell({ children: [new Paragraph(reservation.date)] }),
                    new TableCell({ children: [new Paragraph(reservation.time)] }),
                    new TableCell({ children: [new Paragraph(reservation.guests.toString())] }),
                    new TableCell({ children: [new Paragraph(reservation.requests)] }),
                ]
            }));
        });

        const table = new Table({ rows: tableRows });
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({ text: "Reservations Report", heading: HeadingLevel.HEADING_1 }),
                    table
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "ReservationsReport.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    render() {
        const {
            reservations,
            selectedIds,
            reservationForm,
            isEditing,
            showModal,
            selectedReservation,
            searchQuery,
            filterDate,
            currentPage,
            itemsPerPage
        } = this.state;

        // Фильтрация бронирований по имени и дате
        const filteredReservations = reservations.filter(reservation => {
            const matchesSearch = reservation.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDate = filterDate ? reservation.date === filterDate : true;
            return matchesSearch && matchesDate;
        });

        // Пагинация
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

        return (
            <div className="container py-5">
                <h2 className="text-center mb-4">Manage Reservations</h2>

                {/* Форма добавления/редактирования бронирования */}
                <div className="card mb-5">
                    <div className="card-header">
                        <h5>{isEditing ? 'Edit Reservation' : 'Add New Reservation'}</h5>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={reservationForm.name}
                                    onChange={this.handleInputChange}
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={reservationForm.date}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="time"
                                    className="form-control"
                                    name="time"
                                    value={reservationForm.time}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="guests"
                                    value={reservationForm.guests}
                                    onChange={this.handleInputChange}
                                    placeholder="Number of Guests"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="requests"
                                    value={reservationForm.requests}
                                    onChange={this.handleInputChange}
                                    placeholder="Special Requests"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.handleAddOrUpdateReservation}
                            >
                                {isEditing ? 'Update Reservation' : 'Add Reservation'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Поля поиска и фильтрации */}
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
                        <input
                            type="date"
                            className="form-control"
                            value={filterDate}
                            onChange={this.handleFilterDateChange}
                        />
                    </div>
                </div>

                {/* Список бронирований */}
                <h3 className="mb-3">Reservations List</h3>
                <table className="table table-hover">
                    <thead className="table-dark">
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
                        {currentReservations.map((reservation) => (
                            <tr
                                key={reservation.id}
                                className={selectedIds.includes(reservation.id) ? 'table-info' : ''}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(reservation.id)}
                                        onChange={() => this.handleSelectToggle(reservation.id)}
                                    />
                                </td>
                                <td>{reservation.name}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.time}</td>
                                <td>{reservation.guests}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => this.openModal(reservation)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => this.handleEditClick(reservation)}
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
                                <li
                                    key={pageNumber}
                                    className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                >
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

                {/* Кнопки удаления и создания отчёта */}
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
                {showModal && selectedReservation && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        onClick={this.closeModal}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Reservation Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={this.closeModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Name:</strong> {selectedReservation.name}</p>
                                    <p><strong>Date:</strong> {selectedReservation.date}</p>
                                    <p><strong>Time:</strong> {selectedReservation.time}</p>
                                    <p><strong>Guests:</strong> {selectedReservation.guests}</p>
                                    <p><strong>Special Requests:</strong> {selectedReservation.requests}</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={this.closeModal}
                                    >
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
