import { useState, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import QuotationTable from "./QuotationTable";
import productsData from './products.json';

function App() {
  const itemRef = useRef();
  const ppuRef = useRef();
  const qtyRef = useRef();
  const discountRef = useRef();

  const [dataItems, setDataItems] = useState([]);
  const [ppu, setPpu] = useState(productsData.products[0].price);

  const addItem = () => {
    let item = productsData.products.find((v) => itemRef.current.value === v.code);

    const newItem = {
      item: item.name,
      ppu: parseFloat(ppuRef.current.value),
      qty: parseInt(qtyRef.current.value),
      discount: parseFloat(discountRef.current.value) || 0,
    };

    setDataItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        i => i.item === newItem.item && i.ppu === newItem.ppu
      );

      if (existingItemIndex > -1) {
        // Item exists, merge it
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          qty: updatedItems[existingItemIndex].qty + newItem.qty,
          discount: updatedItems[existingItemIndex].discount + newItem.discount
        };
        return updatedItems;
      } else {
        // Item is unique, add it as a new item
        return [...prevItems, newItem];
      }
    });
  };

  const clearDataItems = () => {
    setDataItems([]);
  }

  const deleteByIndex = (index) => {
    let newDataItems = [...dataItems];
    newDataItems.splice(index, 1);
    setDataItems(newDataItems);
  }

  const productChange = () => {
    let item = productsData.products.find((v) => itemRef.current.value === v.code)
    setPpu(item.price)
  }

  return (
    <Container>
      <Row>
        <Col md={4} style={{ backgroundColor: "#e4e4e4" }}>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={productChange}>
                {
                  productsData.products.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))
                }
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control type="number" ref={ppuRef} value={ppu} onChange={e => setPpu(e.target.value)} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={qtyRef} defaultValue={1} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Discount</Form.Label>
              <Form.Control type="number" ref={discountRef} defaultValue={0} />
            </Col>
          </Row>
          <hr />
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={addItem}>
              Add
            </Button>
          </div>
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            deleteByIndex={deleteByIndex} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;