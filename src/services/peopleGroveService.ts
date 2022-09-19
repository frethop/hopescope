import axios from "axios";
import { PeopleGroveAlum } from "models";
import aws from "aws-sdk";
import { parse } from "papaparse";

// All the credentials to access the People Grove bucket
const s3 = new aws.S3({
  accessKeyId: process.env.REACT_APP_AMAZON_S3_ACCESS_KEY_ID,
  apiVersion: "latest",
  region: "us-east-1",
  secretAccessKey: process.env.REACT_APP_AMAZON_S3_SECRET_ACCESS_KEY,
});

const params = { Bucket: "pg-hopecollege-prod-618/BCApp", Key: "BCAppData.csv" };

/** This function would fetch the CSV file from AWS S3 bucket and
 *  convert that CSV file into an array of People Grove ALum object */
export async function fetchAllPeopleGroveAlumni(): Promise<PeopleGroveAlum[]> {
  const response = await s3.getObject(params).promise();
  // alum is an array of raw, unfiltered JSON object of Alumni profile
  const alum: PeopleGroveAlum[] = [];

  if (response.Body != null) {
    // first we convert the data fetched into a string
    const fileContent = response.Body.toString("utf-8");
    /** then parse the string into JSON object using Papa Parse and store them in the alum array
     * we also have to change the type of some of the field like id into number using dynamic Typing
     * then remove some of the special character and white space */
    parse(fileContent, {
      complete(result) {
        result.data.map(data => {
          return alum.push(data as PeopleGroveAlum);
        });
      },
      dynamicTyping: true,
      header: true,
      transformHeader(h) {
        return h.replace("/", "").toLowerCase().replaceAll(" ", "");
      },
    });
    /** Finally we return the an array of People Grove ALum object with the listed field
     * We also want to remove the empty lastitude and longitude profile
     */
    const peopleGroveAlum = alum.map((user: any) => {
      const geolocation = JSON.stringify(user.locationlatitudelongitude);
      // eslint-disable-next-line quotes
      const geocode = geolocation.split(", ");
      const latitude = parseFloat(geocode[0].slice(1));
      const longitude = parseFloat(geocode[1]);
      return {
        cluster: false,
        companyTitle: user.currentcompany,
        firstName: user.firstname,
        id: user.peoplegroveid,
        identifier: user.identifier,
        lastName: user.lastname,
        latitude,
        location: user.location,
        longitude,
        majors: user.educationhistory,
        photoUrl: user.photourl,
        role: user.currentjobtitle,
        type: "alum",
      } as PeopleGroveAlum;
    });

    return peopleGroveAlum.filter(
      user =>
        !((!user.latitude && user.latitude !== 0) || (!user.longitude && user.longitude !== 0)),
    );
  }
  return [];
}
