import React from "react";
import Button from "@mui/material/Button";
import Favorite from "./Favorite";
import { getUser } from "../util/firebase.config";

export default function Message({ message }) {
  const [username, setUsername] = React.useState();
  React.useEffect(() => {
    async function effect() {
      const user = await getUser(message.authorId);

      setUsername(user.username);
    }

    effect();
  }, [message.authorId]);

  return (
    <div
      key={message.id}
      style={{
        backgroundColor: "#c6cbc6",
        height: "100%",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        margin: 15,
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "10px 10px 0 10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            {message.authorAvatar && (
              <img
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                }}
                src={message.authorAvatar}
                alt="profile"
              />
            )}
          </div>
          <div>
            <p style={{ color: "white", marginLeft: 15 }}>{username}</p>
          </div>
        </div>
        <div>
          <p style={{ color: "white" }}>
            {new Date(message.date).toISOString()}
          </p>
        </div>
      </div>
      <div>
        <p style={{ color: "white", marginLeft: 15 }}>{message.content}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0px 15px 10px 15px",
        }}
      >
        <div>
          <Favorite />
        </div>
        <div>
          <Button size="small">Share</Button>
        </div>
        <div>
          <Button size="small">Follow</Button>
        </div>
      </div>
    </div>
  );
}

// export default class Message extends React.Component {
//   constructor({ message }) {
//     super(message);
//     this.state = {};
//   }

//   async getUsername() {
//     console.log("authorId test:", this.props.message.authorId);
//     const user = await getUser(this.props.message.authorId);
//     this.setState({ username: user.username });
//   }

//   render() {
//     const { message } = this.props;
//     const { username } = this.state;
//     // const { userName: username } = message;
//     !username && this.getUsername();
//     return (
//       <div
//         key={message.id}
//         style={{
//           backgroundColor: "#c6cbc6",
//           height: "100%",
//           width: "50%",
//           display: "flex",
//           flexDirection: "column",
//           alignSelf: "center",
//           margin: 15,
//           borderRadius: "4px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             margin: "10px 10px 0 10px",
//           }}
//         >
//           <div style={{ display: "flex", flexDirection: "row" }}>
//             <div>
//               {message.authorAvatar && (
//                 <img
//                   style={{
//                     width: "45px",
//                     height: "45px",
//                     borderRadius: "50%",
//                   }}
//                   src={message.authorAvatar}
//                   alt="profile"
//                 />
//               )}
//             </div>
//             <div>
//               <p style={{ color: "white", marginLeft: 15 }}>{username}</p>
//             </div>
//           </div>
//           <div>
//             <p style={{ color: "white" }}>
//               {new Date(message.date).toISOString()}
//             </p>
//           </div>
//         </div>
//         <div>
//           <p style={{ color: "white", marginLeft: 15 }}>{message.content}</p>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             margin: "0px 15px 10px 15px",
//           }}
//         >
//           <div>
//             <Favorite id={message.id} />
//           </div>
//           <div>
//             <Button size="small">Share</Button>
//           </div>
//           <div>
//             <Button size="small">Follow</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
