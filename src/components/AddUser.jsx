import React, { useState } from "react";

function AddUser({ onUserAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const newUser = await response.json();
            onUserAdded(newUser);
        } else {
            console.error("Failed to add user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </label>

            <label>
                Role:
                <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="USER">USER</option>
                    <option value="TRAINER">TRAINER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </label>

            <button type="submit">Add User</button>
        </form>
    );
}

export default AddUser;