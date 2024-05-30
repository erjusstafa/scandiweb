<?php

namespace App\Models;

class Atribute
{

    public function encodeAttributes($attributesData)
    {
        return json_encode($attributesData ?? []);
    }
}
