import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function verAlerta(mensaje,icono,foco=''){

    const  Myswal= withReactContent(Swal);
    onFocus(foco);
    Myswal.fire({
        title:mensaje,
        icon: icono,
       
    });


}

function onFocus(foco) {
    if (foco!=='') {
    document.getElementById(foco).focus();
    } 
}