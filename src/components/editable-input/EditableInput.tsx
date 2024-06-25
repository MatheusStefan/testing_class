import { ChangeEvent, useState } from "react";

type Props = {
  item: { id: number; text: string };
  handleDelete: (id: number) => () => void;
  handleEdit: (id: number, text: string) => void;
};

export function EditableInput({
  item,
  handleDelete,
  handleEdit,
}: Readonly<Props>) {
  const [onEdit, setOnEdit] = useState(false);
  const handleSetEdit = () => setOnEdit((state) => !state);
  const handleCancelEdit = () => setOnEdit(false);
  const [inputValue, setInputValue] = useState(item.text);

  const handleType = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleApplyEdit = () => {
    setOnEdit(false);
    handleEdit(item.id, inputValue);
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "1",
  };
  const buttons = { display: "flex", gap: "10px" };

  return (
    <>
      {onEdit ? (
        <div style={style}>
          <input
            data-testid="input-element"
            onChange={handleType}
            value={inputValue}
          />
          <div style={buttons}>
            <button data-testid="applyButton" onClick={handleApplyEdit}>Apply</button>
            <button data-testid="cancelButton" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={style}>
          <p data-testid="text-element">{inputValue}</p>
          <div style={buttons}>
            <button data-testid="deleteButton" onClick={handleDelete(item.id)}>Delete</button>
            <button data-testid="editButton" onClick={handleSetEdit}>Edit</button>
          </div>
        </div>
      )}
    </>
  );
}
