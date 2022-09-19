import { Mappable } from "models";

export interface PeopleGroveAlum extends Mappable {
  type: "alum";
  identifier: string;
  firstName: string;
  lastName: string;
  location: string;
  photoUrl: string;
  majors: string;
  cluster: false;
  role: string;
  companyTitle: string;
}
