import React, { useEffect, useState } from "react";
import "./MemberTable.css"; 

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MemberTable: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5271/api/AdminUser/users", {
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

  if (loading) {
    return <p>Laddar medlemmar...</p>;
  }

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
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name || "-"}</td>
              <td>
                {member.email ? (
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                ) : (
                  "-"
                )}
              </td>
              <td>{member.role || "Medlem"}</td>
              <td>
                <button className="edit-btn">✏️</button>
                <button className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;