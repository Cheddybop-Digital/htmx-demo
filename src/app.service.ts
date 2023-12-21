import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  tableData() {
    return { message: "Hello HTMX!" };
  }
}
