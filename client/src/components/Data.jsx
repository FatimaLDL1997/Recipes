import { useEffect, useState } from "react";
import axios from "axios";

const Data = () => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState([]);
  const [nextClicked, setNextClicked] = useState(false)
  const [url, setUrl] = useState(
    `https://api.edamam.com/api/recipes/v2?type=public&q={search}&app_id=b434e6f7&app_key=4e13741d470751443209bf9d0273f568&diet=balanced`
  );

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      //   let url =
      //     "https://api.edamam.com/api/recipes/v2?type=public&app_id=b434e6f7&app_key=4e13741d470751443209bf9d0273f568&diet=balanced";

      //   let url =
      //     "https://api.edamam.com/api/recipes/v2?type=public&app_id=17140a25&app_key=578ce7d9ba81a3704b251dec8aff381f&diet=balanced";
      try {
        const response = await axios.get(url);
        setData(response.data.hits);
        setResponse(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data from API:", error);
        throw error;
      }
    };

    fetchDataFromAPI();
  }, [nextClicked]);

  const goToNextPage = () => {
    if (response.length != 0) {
      console.log(response._links.next.href);
      setUrl(response._links.next.href);
      setNextClicked(!nextClicked)
    //   fetchDataFromAPI();
    }
  };
  

  return (
    <>
      <div>
        {data.length != 0 &&
          data.map((item, index) => {
            return <h2 key={index}>{item.recipe.label};</h2>;
          })}
      </div>
      <button onClick={() => goToNextPage()}>Next</button>
    </>
  );
};

export default Data;
