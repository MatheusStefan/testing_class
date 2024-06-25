import { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditableInput } from "../editable-input/EditableInput";

export function ToDo() {
  const [list, setList] = useState<{ id: number; text: string }[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleAdd = () => {
    setList((state) => [...state, { id: new Date().getTime(), text: value }]);
    setValue("");
  };

  const handleDelete = (id: number) => () => {
    setList((state) => state.filter((item) => item.id !== id));
  };

  const handleType = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleEdit = (id: number, value: string) => () =>
    setList((state) => {
      return state.map((item) => {
        if (id === item.id) {
          return { ...item, text: value };
        }
        return item;
      });
    });

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 data-testid="title">Todo List</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          ref={inputRef}
          data-testid="input-element"
          value={value}
          onChange={handleType}
          type="text"
          placeholder="Type your task"
        />
        <div>
          <button
            disabled={!value}
            onClick={handleAdd}
            data-testid="button-element"
          >
            Submit
          </button>
        </div>
      </div>
      <ul
        style={{
          width: "100%",
          padding: "5px",
        }}
      >
        {list.map((item) => (
          <li
            data-testid="todo-list"
            key={item.id}
            style={{
              width: "100%",
              borderTop: "1px solid grey",
              padding: "20px 30px",
              height: "80px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <EditableInput
              item={item}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
