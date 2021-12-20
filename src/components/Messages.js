import React, { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import InfoContext from "./InfoContext";
import Message from "./Message";

export default function Messages() {
  const [isLoading, setIsLoading] = useState(false);
  const { messages } = useContext(InfoContext);

  const [theMessages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(messages.slice(0, 10));
  }, []);

  const loader = useRef(null);

  const loadMore = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting && !isLoading) {
        setIsLoading(true);
        setTimeout(function () {
          const more = messages.slice(
            theMessages.length,
            theMessages.length + 10
          );
          const combined = [...theMessages, ...more];

          setIsLoading(false);
          setMessages(combined);
        }, 1000);
      }
    },
    [messages, theMessages.length]
  );

  useEffect(() => {
    const options = {
      root: null, // window by default
      rootMargin: "10px",
      threshold: 0.25,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (loader && loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader && loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, loadMore]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 960,
        maxWidth: "100%",
      }}
    >
      {Array.isArray(theMessages) &&
        [...theMessages]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((message) => {
            return <Message message={message} />;
          })}
      <div ref={loader} style={{ textAlign: "center" }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : theMessages.length === messages.length ? (
          <p>Loaded all the messages! :)</p>
        ) : null}
      </div>
    </div>
  );
}
