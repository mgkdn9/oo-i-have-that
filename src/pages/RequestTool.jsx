import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Form, Button, Alert, InputGroup } from "react-bootstrap";

export default function RequestTool({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toolRequest = location.state?.tr;

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [timeNeeded, setTimeNeeded] = useState("");
  const [firstOfferPrice, setFirstOfferPrice] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  useEffect(() => {
    if (toolRequest) {
      setTitle(toolRequest.title);
      setTimeNeeded(toolRequest.timeNeeded);
      setFirstOfferPrice(toolRequest.firstOfferPrice);
      setPictureUrl(toolRequest.pictureUrl || "");
    }
  }, [toolRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = toolRequest
        ? `${process.env.REACT_APP_API_URL}/toolRequests/${toolRequest._id}`
        : `${process.env.REACT_APP_API_URL}/createToolRequest`;
      const method = toolRequest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          timeNeeded,
          firstOfferPrice,
          pictureUrl,
          createdBy: user._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error submitting tool request");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-2 px-3">
      <Card
        style={{ maxWidth: "600px", width: "100%" }}
        className="shadow mb-2"
      >
        <Card.Body>
          <Card.Subtitle className="mb-3 text-muted">
            {toolRequest ? "Edit Tool Request" : "Request a Tool"}
          </Card.Subtitle>
          <Card.Title className="mb-3 fs-3">
            {toolRequest ? toolRequest.title : ""}
          </Card.Title>

          {pictureUrl && (
            <div className="text-center mb-3">
              <img
                src={`${pictureUrl}.jpg`}
                alt="Tool"
                style={{ maxHeight: "200px", borderRadius: "4px" }}
              />
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tool title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="timeNeeded">
              <Form.Label>Time Needed</Form.Label>
              <Form.Control
                type="text"
                value={timeNeeded}
                onChange={(e) => setTimeNeeded(e.target.value)}
                placeholder="E.g., 2 days"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="firstOfferPrice">
              <Form.Label>First Offer Price</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={firstOfferPrice}
                  onChange={(e) => setFirstOfferPrice(e.target.value)}
                  placeholder="Enter your offer"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="pictureUrl">
              <Form.Label>Picture URL (optional)</Form.Label>
              <Form.Control
                type="url"
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/profile")}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {toolRequest ? "Save Changes" : "Submit Request"}
              </Button>
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
