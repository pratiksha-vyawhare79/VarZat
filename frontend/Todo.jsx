import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Button, InputGroup, FormControl, ListGroup } from "react-bootstrap";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: "",
            list: [],
        };
    }

    componentDidMount() {
        this.fetchTodos();
    }

    fetchTodos = () => {
        fetch('http://localhost:5000/api/todos')
            .then(res => res.json())
            .then(data => this.setState({ list: data }))
            .catch(err => console.error("Database connection error:", err));
    }

    addItem() {
        if (this.state.userInput !== "") {
            fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: this.state.userInput })
            })
            .then(res => res.json())
            .then(() => {
                this.fetchTodos();
                this.setState({ userInput: "" });
            });
        }
    }

    deleteItem(id) {
        fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' })
            .then(() => this.fetchTodos());
    }

    editItem = (id, currentValue) => {
        const editedTodo = prompt('Edit the todo:', currentValue);
        if (editedTodo !== null && editedTodo.trim() !== '') {
            fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editedTodo })
            }).then(() => this.fetchTodos());
        }
    }

    render() {
        return (
            <Container className="mt-5">
                <Row className="text-center mb-4">
                    <Col><h1>TODO LIST</h1></Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Add item . . ."
                                value={this.state.userInput}
                                onChange={(e) => this.setState({ userInput: e.target.value })}
                            />
                            <Button variant="dark" onClick={() => this.addItem()}>ADD</Button>
                        </InputGroup>
                        <ListGroup>
                            {this.state.list.map((item) => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    {item.title}
                                    <div>
                                        <Button variant="danger" size="sm" className="me-2" onClick={() => this.deleteItem(item.id)}>Delete</Button>
                                        <Button variant="info" size="sm" onClick={() => this.editItem(item.id, item.title)}>Edit</Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
