import React, { useEffect, useState } from "react";
import "./MemberTable.css";
import { BASE_URL } from "../../../config";
import LoadingSpinner from "../../loading/loadingComponent";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
const MemberTable: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Medlem",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/AdminUser/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Fel vid API-anrop: ${response.status}`);
        }

        const data: Member[] = await response.json();
        setMembers(data);
      } catch (err: any) {
        console.error("Fel vid hämtning av användare:", err);
        setError(err.message || "Något gick fel");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna användare?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/AdminUser/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Kunde inte ta bort medlem");

      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Fel vid borttagning:", error);
      alert("Kunde inte ta bort medlem, försök igen.");
    }
  };

  const handleEditClick = (member: Member) => {
    setEditingId(member.id);
    setEditFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const dto = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        isAdmin: editFormData.role === "Admin",
      };

      const response = await fetch(`${BASE_URL}/AdminUser/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) throw new Error("Kunde inte uppdatera medlem");

      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, ...editFormData } : member
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Fel vid uppdatering:", error);
      alert("Kunde inte uppdatera medlem, försök igen.");
    }
  };


  if (error) {
    return <p style={{ color: "red" }}>Fel: {error}</p>;
  }

  return (
    <div className="memberTableContainer">
      <h2>Medlemskapshantering</h2>
      <table>
        <thead>
          <tr>
            <th>Medlem</th>
            <th>E-post</th>
            <th>Roll</th>
            <th>Redigera</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                <div className="loadingContainerMembers">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : members.length > 0 ? (
            members.map((member) => (
              <tr key={member.id}>
                <td>
                  {editingId === member.id ? (
                    <>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                        placeholder="Förnamn"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                        placeholder="Efternamn"
                      />
                    </>
                  ) : (
                    <>
                      <div>{member.firstName || "-"}</div>
                      <div>{member.lastName || ""}</div>
                    </>
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                    />
                  ) : member.email ? (
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleInputChange}
                    >
                      <option value="Medlem">Medlem</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    member.role || "Medlem"
                  )}
                </td>
                <td>
                  {editingId === member.id ? (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleSaveClick(member.id)}
                      >
                        💾
                      </button>
                      <button className="delete-btn" onClick={handleCancelClick}>
                        ✖️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(member)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(member.id)}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Inga medlemmar hittades
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default MemberTable;