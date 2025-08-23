import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Form, Button, Alert, Image, InputGroup } from "react-bootstrap";

export default function Respond({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tr } = location.state || {};

  const [error, setError] = useState("");
  const [counterOfferPrice, setCounterOfferPrice] = useState("");

  useEffect(() => {
    if (!tr) {
      navigate("/"); // no request passed
      return;
    }
    if (user && user._id === tr.createdBy._id) {
      navigate("/"); // redirect to home if they tried to respond to their own tr
    } else if (tr && !counterOfferPrice) {
      setCounterOfferPrice(tr.firstOfferPrice);
    }
  }, [tr, user, navigate]);

  if (!tr) return <p className="text-center mt-4">Loading...</p>;

  const handleRespond = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/createResponse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalTR: tr._id,
            counterOfferPrice,
            seeker: tr.createdBy._id,
            owner: user._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error creating tool response");
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
        <Card.Body className="pb-2 mb-2">
          <Card.Subtitle className="mb-3 text-muted">
            Respond to Request
          </Card.Subtitle>
          <Card.Title className="mb-3 fs-3">{tr.title}</Card.Title>

          {tr.pictureUrl && (
            <div className="text-center mb-3">
              <Image
                src={`${tr.pictureUrl}.jpg`}
                alt="Tool"
                rounded
                fluid
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          <div className="mb-3">
            <p>
              <strong>Time Needed:</strong> {tr.timeNeeded}
            </p>
            <p>
              <strong>Offering:</strong> ${tr.firstOfferPrice}
            </p>
          </div>

          <Form onSubmit={handleRespond}>
            <Form.Group className="mb-3" controlId="counterOfferPrice">
              <Form.Label>Counter Offer</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={counterOfferPrice}
                  onChange={(e) => setCounterOfferPrice(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Response
              </Button>
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <p className="text-muted small mt-3 mb-0">
            ⚠️ Clicking <strong>Submit Response</strong> will provide the
            requester with your phone number.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
