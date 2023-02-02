// import React, { useState, useEffect } from "react";

// import { useMutation } from "@apollo/client";

// import axios from 'axios';

// const apiKey = 'odAC47mAXREvZ3HvHdv5XieoP4WcAzVm'

// const viewBestSellers = () => {
//     const [post, setPost] = useState([]);

//     useEffect(()=> {
//     axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`)
//     .then((data)=>{setPost(data?.data);
//     });
// }, [])

//     return (
//         <div>
//           viewBestSellers
//           {post.map((item, i) => {
//             return (
//               <div key={i}>
//                 <p>{item?.name}</p>
//               </div>
//             );
//           })}
//         </div>
//       );

// };

// export default viewBestSellers
  