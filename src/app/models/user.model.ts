export class User {
  constructor(
    public email: string,
    public id: string,
    // tslint:disable-next-line: variable-name
    private _token: string,
    // tslint:disable-next-line: variable-name
    private _tokenExpirationDate: Date
  ) { }

  public getToken() {
    const isInvalid = new Date(Date.now()).getTime() > new Date(this._tokenExpirationDate).getTime();
    if (!this._tokenExpirationDate || isInvalid) {
      return null;
    }
    return this._token;
  }
}

export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: Date;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
  cPassword: string;
}
