sub update_view_data {
   my $self = shift;
   my $properties = shift;
   my $service = $self->{vim}->get_vim_service();
   if ($^O =~ /MSWin32/) {
      #to remove SOAP error caused by utf8 character
      $self->{mo_ref}->{value} = encode_utf8($self->{mo_ref}->{value});
   }
   my $property_filter_spec = (ref $self)->get_property_filter_spec($self->{mo_ref});
   my $propertyCollector = $self->{vim}->get_service_content()->propertyCollector;
   if (defined($properties) && $properties ne "") {
      my $ptr = $property_filter_spec->propSet;
      my $obj = $$ptr[0];
      $obj->all(0);  
      $obj->pathSet ($properties);
   }
   my $obj_contents =
      $service->RetrieveProperties(_this => $propertyCollector,
                                   specSet => $property_filter_spec);
   Util::check_fault($obj_contents);
   foreach (@{$obj_contents->result}) {
      $self->set_view_data($_, $properties);
   }
}

sub set_view_data {
   my ($self, $obj_content, $properties) = @_;
   my $prop_set = $obj_content->propSet;
   foreach (@$prop_set) {
      my $name = $_->name;
      if (!$properties || $properties eq "") {
         my @path_elements = split /\./, $name;
         $name = pop @path_elements;
      }
      $self->{$name} = $_->val;
   }
}

