import { ReferenceVisitor } from './reference.visitor';

const MAX_REFERENCES = 100;

export class ReferenceContext {
  references: ReferenceVisitor[] = [];
  currentReferenceIndex: number;

  next(times = 1) {
    if (this.references[this.currentReferenceIndex + times]) {
      this.currentReferenceIndex++;
    }
  }

  back(times = 1) {
    if (this.references[this.currentReferenceIndex - times]) {
      this.currentReferenceIndex--;
    }
  }

  reset() {
    this.currentReferenceIndex = this.references.length - 1;
  }

  getCurrentReference() {
    return this.references[this.currentReferenceIndex];
  }

  addReference(reference: ReferenceVisitor) {
    this.references.push(reference);

    if (this.references.length > MAX_REFERENCES) {
      this.references.shift();
    }

    this.reset();
  }

  // removeReference(times = 1) {
  //   XXXXXXX this.references = this.references.slice()
  // }
}
