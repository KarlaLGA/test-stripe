import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
//import { useNavigate } from "react-router-dom";
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";

export default function Subscribe() {
  const stripePromise = loadStripe("pk_test_JFAd4rBJg6cJv44RWIBOXdCg");
  return (
    <Elements stripe={stripePromise}>
      <SubscribeElement />
    </Elements>
  );
}

function SubscribeElement() {
  //const navigate = useNavigate();
  const client = "COPY FROM EMAIL";
  // Get the lookup key for the price from the previous page redirect.
  const [clientSecret] = useState(client);
  //const [subscriptionId] = useState(stripeSubs.subscriptionId);
  const [name, setName] = useState("Jenny Rosen");
  const [messages, setMessages] = useState("");
  const [paymentIntent, setPaymentIntent] = useState();

  console.log(clientSecret);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  // helper for displaying status messages.
  const setMessage = (message) => {
    setMessages(`${messages}\n\n${message}`);
  };

  // When the subscribe-form is submitted we do a few things:
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use card Element to tokenize payment details
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name
          }
        }
      })
      .then((result) => {
        if (result.error) {
          // show error and collect new card details.
          setMessage(result.error.message);
        }
        setPaymentIntent(paymentIntent);
      });
  };

  return (
    <div>
      {!stripe || !elements ? (
        <p>Not loaded</p>
      ) : (
        <React.Fragment>
          <h1>Subscribe</h1>
          <p>
            Try the successful test card: <span>4242424242424242</span>.
          </p>
          <p>
            Try the test card that requires SCA: <span>4000002500003155</span>.
          </p>
          <p>
            Use any <i>future</i> expiry date, CVC,5 digit postal code
          </p>

          <hr />

          <form onSubmit={(e) => handleSubmit(e)}>
            <label>
              Full name
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <CardElement />

            <button>Subscribe</button>

            <div>{messages}</div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
}
