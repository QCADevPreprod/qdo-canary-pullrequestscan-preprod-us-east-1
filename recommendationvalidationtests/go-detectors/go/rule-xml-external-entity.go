import (
	"fmt"
	"github.com/lestrrat-go/libxml2/parser"
)

func xmlExternalEntityNoncompliant() {
	const s = "<!DOCTYPE d [<!ENTITY e SYSTEM \"file:///etc/passwd\">]><t>&e;</t>"
	// ruleid: rule-xml-external-entity
	p := parser.New(parser.XMLParseNoEnt)
	doc, err := p.ParseString(s)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Doc successfully parsed!")
	fmt.Println(doc)
}


func xmlExternalEntityCompliant() {
	const s = "<!DOCTYPE d [<!ENTITY e SYSTEM \"file:///etc/passwd\">]><t>&e;</t>"
	// ok: rule-xml-external-entity
	p := parser.New()
	doc, err := p.ParseString(s)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Doc successfully parsed!")
	fmt.Println(doc)
}
