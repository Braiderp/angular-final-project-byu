export class Document {
  constructor(
    public _id: string | null,
    public id: string | null,
    public name: string,
    public description: string,
    public url: string,
    public chidren: [Document?]
  ) {}
}
